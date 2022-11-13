import { stringify } from "qs";
import { ProjectSearchQuery } from "../../projects/types";

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

