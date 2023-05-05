import { searchClient } from "~/backend";
import { TagIcon } from "~/components/core";
import { PageHeading } from "~/components/core/typography";
import { TagPaginatedList } from "~/components/tag-list/tag-paginated-list";
import { SearchQueryUpdater } from "~/projects/types";
import {
  getTagListSortOptionByValue,
  tagListSortSlugs,
  TagSearchQuery,
  tagSearchStateToQueryString,
} from "./tag-list-shared";

type PageProps = {
  searchParams: {
    limit?: string;
    page?: string;
    sort?: string;
  };
};

export default async function TagsPage({ searchParams }: PageProps) {
  const { tags, total, limit, page, sortOptionId } = await getTagsPageData(
    searchParams
  );

  const searchState = parsePageSearchParams(searchParams);

  function buildTagsPageURL(updater: SearchQueryUpdater<TagSearchQuery>) {
    const nextState = updater(searchState);
    const queryString = tagSearchStateToQueryString(nextState);
    return "/tags?" + queryString;
  }

  return (
    <>
      <PageHeading title="All Tags" icon={<TagIcon size={32} />} />
      <TagPaginatedList
        tags={tags}
        page={page}
        limit={limit}
        total={total}
        sortOptionId={sortOptionId}
        buildTagsPageURL={buildTagsPageURL}
        searchState={searchState}
      />
    </>
  );
}

async function getTagsPageData(searchParams: PageProps["searchParams"]) {
  const { sortOptionId, page, limit } = parsePageSearchParams(searchParams);
  const sortOption = getTagListSortOptionByValue(sortOptionId);
  const skip = limit * (page - 1);
  const { tags, total } = await searchClient.findTagsWithProjects({
    limit,
    skip,
    sort: sortOption.sort,
  });

  return {
    tags,
    page,
    limit,
    sortOptionId,
    total,
  };
}

function parsePageSearchParams(
  searchParams: PageProps["searchParams"]
): TagSearchQuery {
  return {
    page: toInteger(searchParams.page, 1),
    limit: toInteger(searchParams.limit, 20),
    sortOptionId: (searchParams.sort ||
      tagListSortSlugs.PROJECT_COUNT) as TagSearchQuery["sortOptionId"],
  };
}

function toInteger(input: string | undefined, defaultValue = 1) {
  if (!input) return defaultValue;
  return isNaN(Number(input)) ? defaultValue : parseInt(input, 0);
}
