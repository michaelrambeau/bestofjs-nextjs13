import { stringify } from "qs";

import { searchClient } from "../backend";
import { ProjectPaginatedList } from "../components/project-list/project-paginated-list";
import {
  SortOption,
  SortOptionKey,
  sortOrderOptionsByKey,
} from "../components/project-list/sort-order-options";
import { ProjectSearchQuery, ProjectSearchQueryUpdater } from "./types";

export const revalidate = 0; // needed otherwise Next.js always renders the same page, ignoring the query string parameters

type ProjectPageSearchParams = {
  tags?: string;
  query?: string;
  page?: string;
  limit?: string;
  sort?: string;
};

type ProjectsPageData = {
  projects: BestOfJS.Project[];
  total: number;
  page: number;
  limit: number;
  selectedTags: BestOfJS.Tag[];
  relevantTags: BestOfJS.Tag[];
  sortOptionId: SortOptionKey;
};

type PageProps = {
  searchParams: ProjectPageSearchParams;
};
export default async function Projects({ searchParams }: PageProps) {
  const { projects, page, limit, total, sortOptionId } = await getData(
    searchParams
  );

  const searchState = parseSearchParams(searchParams);

  const buildPageURL = (updater: ProjectSearchQueryUpdater) => {
    const nextState = updater(searchState);
    const queryString = stateToQueryString(nextState);
    return "/projects?" + queryString;
  };

  return (
    <>
      <ProjectPaginatedList
        projects={projects}
        page={page}
        limit={limit}
        total={total}
        sortOptionId={sortOptionId}
        searchState={searchState}
        buildPageURL={buildPageURL}
      />
    </>
  );
}

async function getData(
  query: ProjectPageSearchParams
): Promise<ProjectsPageData> {
  const { tags, sort, page, limit } = parseSearchParams(query);
  const sortOption = getSortOption(sort);

  const { projects, selectedTags, relevantTags, total } =
    await searchClient.findProjects({
      criteria:
        tags.length > 0
          ? {
              tags: { $all: makeArray(tags) },
            }
          : {},
      sort: sortOption.sort,
      skip: limit * (page - 1),
      limit,
    });

  return {
    projects,
    total,
    page,
    limit,
    sortOptionId: sortOption.key,
    selectedTags,
    relevantTags,
  };
}

function getSortOption(sortKey: string): SortOption {
  const defaultOption = sortOrderOptionsByKey.daily;
  if (!sortKey) return defaultOption;
  return sortOrderOptionsByKey[sortKey as SortOptionKey] || defaultOption;
}

const makeArray = (value: string | string[]) =>
  Array.isArray(value) ? value : [value];

// function wait(delay = 2000) {
//   return new Promise((resolve) => setTimeout(resolve, delay));
// }

export function parseSearchParams(
  params: ProjectPageSearchParams
): ProjectSearchQuery {
  return {
    query: "",
    tags: toArray(params.tags),
    page: toInteger(params.page, 1),
    limit: toInteger(params.limit, 10),
    sort: (params.sort || "total") as SortOptionKey,
  };
}

function toInteger(input: string | undefined, defaultValue = 1) {
  if (!input) return defaultValue;
  return isNaN(Number(input)) ? defaultValue : parseInt(input, 0);
}

function toArray(input: string | undefined, separator = "+") {
  return input ? input.split(separator) : [];
}

export function stateToQueryString({
  query,
  tags,
  sort,
  direction,
  page,
}: ProjectSearchQuery) {
  const queryString = stringify(
    {
      query: query || null,
      tags: tags.length === 0 ? null : tags,
      sort: sort === "" ? null : sort,
      page: page === 1 ? null : page,
      direction,
    },
    {
      encode: false,
      arrayFormat: "repeat",
      skipNulls: true,
    }
  );
  return queryString;
}
