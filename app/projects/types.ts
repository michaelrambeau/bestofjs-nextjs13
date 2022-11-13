export type ProjectSearchQuery = {
  tags: string[];
  query: string;
  page: number;
  limit: number;
  sort: string;
  direction?: "desc" | "asc";
};

export type ProjectSearchQueryUpdater = (searchQueryState: ProjectSearchQuery) => ProjectSearchQuery;

export type ProjectUrlBuilder = (updater: ProjectSearchQueryUpdater) => string;