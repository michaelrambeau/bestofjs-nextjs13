export type PaginationProps = {
  page: number;
  limit: number;
};
export type ProjectSearchQuery = {
  tags: string[];
  query: string;
  sort: string;
  direction?: "desc" | "asc";
} & PaginationProps;

export type SearchQueryUpdater<T> = (searchQueryState: T) => T;

export type SearchUrlBuilder<T> = (updater: SearchQueryUpdater<T>) => string;
