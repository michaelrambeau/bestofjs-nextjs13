import debugModule from "debug";
import * as mingo from "mingo";
import { RawObject } from "mingo/types";
import slugify from "slugify";

// const FETCH_ALL_PROJECTS_URL = process.env.JSON_API;
const FETCH_ALL_PROJECTS_URL = "https://bestofjs-static-api.vercel.app";

const debug = debugModule("bestofjs");

type Data = {
  projectCollection: BestOfJS.RawProject[];
  tagCollection: BestOfJS.RawTag[];
  tagsByKey: { [key: string]: BestOfJS.Tag };
  populate: (project: BestOfJS.RawProject) => BestOfJS.Project;
  projectsBySlug: { [key: string]: BestOfJS.RawProject };
  lastUpdateDate: Date;
};

type QueryParams = {
  criteria: RawObject;
  sort: RawObject;
  limit: number;
  skip: number;
  projection: RawObject;
};

const defaultQueryParams: QueryParams = {
  criteria: {},
  sort: { stars: -1 },
  limit: 20,
  skip: 0,
  projection: {},
};

export function createSearchClient() {
  let data: Data;
  async function getData() {
    return data || (await fetchData());
  }

  async function fetchData() {
    const { projects, tags: rawTags, date } = await fetchProjectData();
    const tagsByKey = getTagsByKey(rawTags, projects);
    const projectsBySlug: Data["projectsBySlug"] = {};
    projects.forEach((project) => {
      projectsBySlug[getProjectId(project)] = project;
    });

    data = {
      projectCollection: projects,
      tagCollection: Object.values(tagsByKey),
      populate: populateProject(tagsByKey),
      tagsByKey,
      projectsBySlug,
      lastUpdateDate: date,
    };
    return data;
  }

  return {
    async findProjects(rawSearchQuery: Partial<QueryParams>) {
      const searchQuery = { ...defaultQueryParams, ...rawSearchQuery };
      debug("Find", searchQuery);
      const { criteria, sort, skip, limit, projection } = searchQuery;
      const { projectCollection, populate, tagsByKey, lastUpdateDate } =
        await getData();
      let cursor = mingo.find(projectCollection, criteria, projection);
      const total = cursor.count();

      const allRawProjects = cursor.all() as BestOfJS.RawProject[];

      const rawProjects = mingo
        .find(projectCollection, criteria, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .all() as BestOfJS.RawProject[];

      const projects = rawProjects.map(populate);

      const tagIds: string[] = (criteria?.tags as any)?.$all || [];
      const selectedTags = tagIds.map((tag) => tagsByKey[tag]);

      const relevantTagIds =
        tagIds.length > 0
          ? getResultRelevantTags(allRawProjects, tagIds).map(
              ([id, count]) => id
            )
          : [];

      const relevantTags = relevantTagIds.map((tag) => tagsByKey[tag]);

      return {
        projects,
        selectedTags,
        relevantTags,
        total,
        lastUpdateDate,
      };
    },

    async findTags(searchQuery: QueryParams) {
      const { criteria, sort, skip, limit } = searchQuery;
      const { tagCollection } = await getData();
      const query = new mingo.Query(criteria || {});
      let cursor = query.find(tagCollection);
      const total = cursor.count();

      const tags = query
        .find(tagCollection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .all() as BestOfJS.RawTag[];

      return {
        tags,
        total,
      };
    },

    // return tags with the most popular projects, for each tag
    async findTagsWithProjects(searchQuery: QueryParams) {
      const { criteria, sort, skip, limit } = searchQuery;
      const { tagCollection } = await getData();
      const query = new mingo.Query(criteria || {});
      let cursor = query.find(tagCollection);
      const total = cursor.count();

      const tags = query
        .find(tagCollection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .all() as BestOfJS.TagWithProjects[];

      for await (const tag of tags) {
        const { projects } = await this.findProjects({
          criteria: { tags: { $in: [tag.code] } },
          sort: { stars: -1 },
          limit: 5,
          projection: { name: 1, owner_id: 1, icon: 1 },
        });

        tag.projects = projects;
      }

      return {
        tags,
        total,
      };
    },

    async findOne(criteria: RawObject): Promise<BestOfJS.Project | null> {
      const { projectCollection, populate } = await getData();
      const query = new mingo.Query(criteria);
      const cursor = query.find(projectCollection);
      const projects = cursor.limit(1).all() as BestOfJS.RawProject[];
      return projects.length ? populate(projects[0]) : null;
    },

    async getProjectBySlug(slug: string) {
      const { populate, projectsBySlug } = await getData();
      return populate(projectsBySlug[slug]);
    },
  };
}

export const searchClient = createSearchClient();

function getTagsByKey(
  tags: BestOfJS.RawTag[],
  projects: BestOfJS.RawProject[]
) {
  const byKey = tags.reduce((acc, tag) => {
    return { ...acc, [tag.code]: tag };
  }, {}) as { [tag: string]: BestOfJS.Tag };

  projects.forEach(({ tags }) => {
    tags.forEach((tag) => {
      byKey[tag].counter = byKey[tag].counter ? byKey[tag].counter! + 1 : 1;
    });
  });

  return byKey;
}

const populateProject =
  (tagsByKey: { [key: string]: BestOfJS.Tag }) =>
  (project: BestOfJS.RawProject) => {
    const populated = { ...project } as unknown as BestOfJS.Project;
    const { full_name, tags } = project;

    if (full_name) {
      populated.repository = "https://github.com/" + full_name;
    }

    if (tags) {
      populated.tags = tags.map((id) => tagsByKey[id]).filter((tag) => !!tag);
    }

    populated.slug = getProjectId(project);

    if (project.npm) {
      populated.packageName = project.npm; // TODO fix data?
    }

    return populated;
  };

async function fetchProjectData(): Promise<{
  projects: BestOfJS.RawProject[];
  tags: BestOfJS.RawTag[];
  date: Date;
}> {
  try {
    const url = FETCH_ALL_PROJECTS_URL + `/projects.json`;
    console.log(`Fetching JSON data from ${url}`);
    const options = { next: { revalidate: 60 * 60 } }; // Revalidate in one hour
    const data = await fetch(url, options).then((res) => res.json());

    debug("We got data!", data.date);

    return data as {
      projects: BestOfJS.RawProject[];
      tags: BestOfJS.RawTag[];
      date: Date;
    };
  } catch (error) {
    console.error("Unable to fetch data!", (error as Error).message);
    throw error;
  }
}

// TODO add types: => [[ 'nodejs-framework', 6 ], [...], ...]
function getResultRelevantTags(
  projects: BestOfJS.RawProject[],
  excludedTags: string[] = []
) {
  const projectCountByTag = getTagsFromProjects(projects, excludedTags);
  return orderBy(
    Array.from(projectCountByTag.entries()),
    ([_, count]) => count as number
  ).slice(0, 5) as Array<[tag: string, count: number]>;
}

function orderBy<T>(items: T[], fn: (item: T) => number) {
  return items.sort((a, b) => fn(b) - fn(a));
}

function getTagsFromProjects(
  projects: BestOfJS.RawProject[],
  excludedTagIds: any[] = []
) {
  const result = new Map<string, number>();
  projects.forEach((project) => {
    project.tags
      .filter((tag) => !excludedTagIds.includes(tag))
      .forEach((tagId) => {
        if (result.has(tagId)) {
          result.set(tagId, result.get(tagId)! + 1);
        } else {
          result.set(tagId, 1);
        }
      });
  });
  return result;
}

// TODO read the project's slug from the API instead of computing it here
function getProjectId(project: BestOfJS.RawProject) {
  return slugify(project.name, { lower: true, remove: /[.'/]/g });
}
