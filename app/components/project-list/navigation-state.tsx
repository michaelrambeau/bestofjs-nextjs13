import { encode } from "qss";

import { ProjectSearchQuery } from "../../projects/types";
import { SortOptionKey } from "./sort-order-options";

// Raw params values from URLSearchParams get and getAll(), before parsing
export type ProjectPageSearchParams = {
  tags?: string[];
  query?: string;
  page?: string;
  limit?: string;
  sort?: string;
};

export function stateToQueryString({
  query,
  tags,
  sort,
  direction,
  page,
}: ProjectSearchQuery) {
  const params = {
    query: query || undefined,
    tags: tags.length === 0 ? undefined : tags,
    sort: sort === "" ? undefined : sort,
    page: page === 1 ? undefined : page,
    direction,
  };

  const queryString = encode(params);
  return queryString;
}

export function parseSearchParams(
  params: ProjectPageSearchParams
): ProjectSearchQuery {
  return {
    query: "", // TODO implement full text search
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

function toArray(input: string | string[] | undefined) {
  if (!input) return [];
  return Array.isArray(input) ? input : [input];
}
