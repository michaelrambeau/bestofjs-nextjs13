import {
  parseSearchParams,
  ProjectPageSearchParams,
  stateToQueryString,
} from "~/components/project-list/navigation-state";

import { searchClient } from "../backend";
import { ProjectPaginatedList } from "../components/project-list/project-paginated-list";
import {
  SortOption,
  SortOptionKey,
  sortOrderOptionsByKey,
} from "../components/project-list/sort-order-options";
import { ProjectSearchQuery, SearchQueryUpdater } from "./types";

// needed when running the built app (`start` command)
// otherwise Next.js always renders the same page, ignoring the query string parameters!
// export const revalidate = 0;
export const dynamic = "force-dynamic";

type ProjectsPageData = {
  projects: BestOfJS.Project[];
  total: number;
  page: number;
  limit: number;
  tags: string[];
  selectedTags: BestOfJS.Tag[];
  relevantTags: BestOfJS.Tag[];
  allTags: BestOfJS.Tag[];
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

  const buildPageURL = (updater: SearchQueryUpdater<ProjectSearchQuery>) => {
    const nextState = updater(searchState);
    const queryString = stateToQueryString(nextState);
    return "/projects?" + queryString;
  };

  return (
    <ProjectPaginatedList
      projects={projects}
      page={page}
      limit={limit}
      total={total}
      sortOptionId={sortOptionId}
      searchState={searchState}
      buildPageURL={buildPageURL}
    />
  );
}

async function getData(
  query: ProjectPageSearchParams
): Promise<ProjectsPageData> {
  const { tags, sort, page, limit } = parseSearchParams(query);
  const sortOption = getSortOption(sort);

  const { projects, selectedTags, relevantTags, total } =
    await searchClient.findProjects({
      criteria: tags.length > 0 ? { tags: { $all: tags } } : {},
      sort: sortOption.sort,
      skip: limit * (page - 1),
      limit,
    });

  const { tags: allTags } = await searchClient.findTags({
    criteria: {},
    sort: { name: 1 },
    limit: 300,
    skip: 0,
    projection: {},
  });

  return {
    projects,
    total,
    page,
    limit,
    sortOptionId: sortOption.key,
    selectedTags,
    relevantTags,
    tags,
    allTags,
  };
}

function getSortOption(sortKey: string): SortOption {
  const defaultOption = sortOrderOptionsByKey.daily;
  if (!sortKey) return defaultOption;
  return sortOrderOptionsByKey[sortKey as SortOptionKey] || defaultOption;
}
