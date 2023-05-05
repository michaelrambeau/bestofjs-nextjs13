import { SearchQueryUpdater } from "~/projects/types";
import { TagSearchQuery } from "~/tags/tag-list-shared";
import { TopPaginationControls } from "../core/pagination/pagination-controls";
import { computePaginationState } from "../core/pagination/pagination-state";
import { TagList } from "./tag-list";
import { TagSortOrderPicker } from "./tag-sort-order-picker.client";

type Props = {
  tags: BestOfJS.TagWithProjects[];
  page: number;
  total: number;
  limit: number;
  sortOptionId: string;
  buildTagsPageURL: (updater: SearchQueryUpdater<TagSearchQuery>) => string;
  searchState: TagSearchQuery;
};

export const TagPaginatedList = ({
  searchState,
  buildTagsPageURL,
  tags,
  page,
  total,
  limit,
}: Props) => {
  const showPagination = total > limit;
  const paginationState = computePaginationState({
    total,
    currentPageNumber: page,
    limit,
  });

  return (
    <>
      <div className="flex justify-between mb-4">
        <TagSortOrderPicker
          value={searchState.sortOptionId}
          searchState={searchState}
        />
        {showPagination && (
          <TopPaginationControls
            paginationState={paginationState}
            buildPageURL={buildTagsPageURL}
          />
        )}
      </div>
      <TagList tags={tags} />
    </>
  );
};
