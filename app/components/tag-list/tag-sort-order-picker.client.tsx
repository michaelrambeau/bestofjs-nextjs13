"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  tagListSortOptions,
  TagListSortSlug,
  TagSearchQuery,
  tagSearchStateToQueryString,
} from "~/tags/tag-list-shared";

import { DropdownMenu, Menu, MenuItem } from "../core/menu";

type Props = {
  value: TagListSortSlug;
  searchState: TagSearchQuery;
};
export const TagSortOrderPicker = ({ value, searchState }: Props) => {
  const currentOption = tagListSortOptions.find(
    (option) => option.value === value
  );

  const menu = (
    <Menu>
      {tagListSortOptions.map(({ value, text }) => {
        const nextState: TagSearchQuery = {
          ...searchState,
          page: 1,
          sortOptionId: value,
        };
        const queryString = tagSearchStateToQueryString(nextState);
        const url = `/tags?` + queryString;

        return (
          <MenuItem href={url} key={value}>
            {text}
          </MenuItem>
        );
      })}
    </Menu>
  );

  return (
    <DropdownMenu menu={menu} left={0} right={"inherit"}>
      <button className="btn btn-outline gap-2">
        <>
          Sort: {currentOption?.text || ""}
          <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
        </>
      </button>
    </DropdownMenu>
  );
};
