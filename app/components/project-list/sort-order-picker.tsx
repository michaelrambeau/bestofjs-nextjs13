"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { DropdownMenu, Menu, MenuGroup, MenuItem } from "../core/menu";
import { stateToQueryString } from "./navigation-state";
import { SortOptionKey, sortOrderOptionsByKey } from "./sort-order-options";

const sortOptionGroups: SortOptionKey[][] = [
  ["total"],
  ["daily", "weekly", "monthly", "yearly"],
  ["monthly-downloads"],
  // ["last-commit", "contributors"],
  // ["created", "newest"],
  // ["bookmark"],
];

type Props = { value: SortOptionKey; searchState: any };
export const SortOrderPicker = ({ value, searchState }: Props) => {
  // const searchContext = useSearch();

  const currentOption = sortOrderOptionsByKey[value];

  const menu = (
    <Menu>
      {sortOptionGroups.map((group, index) => {
        return (
          <MenuGroup key={index}>
            {group.map((id) => {
              const item = sortOrderOptionsByKey[id];
              const nextState = { ...searchState, page: 1, sort: item.key };
              const queryString = stateToQueryString(nextState);
              const url = `/projects?` + queryString;

              return (
                <MenuItem href={url} key={id}>
                  {item.label}
                </MenuItem>
              );
            })}
          </MenuGroup>
        );
      })}
    </Menu>
  );

  return (
    <DropdownMenu menu={menu} left={0} right={"inherit"}>
      <button className="btn btn-outline gap-2">
        <>
          Sort: {currentOption?.label || ""}
          <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
        </>
      </button>
    </DropdownMenu>
  );
};
