import React from "react";

import { ProjectScore, ProjectTable } from "./project-table";
import {
  TopPaginationControls,
  // BottomPaginationControls,
} from "../core/pagination/pagination-controls";
import {
  computePaginationState,
} from "../core/pagination/pagination-state";
import { SortOrderPicker } from "./sort-order-picker";
import { SortOptionKey } from "./sort-order-options";

type Props = {
  projects: BestOfJS.Project[];
  page: number;
  total: number;
  limit: number;
  sortOptionId: string;
  searchState: any;
  buildPageURL: any;
};
export const ProjectPaginatedList = ({
  projects,
  page,
  total,
  limit,
  sortOptionId,
  buildPageURL,
  searchState,
}: Props) => {
  // const { pageNumbers } = PaginationContainer.useContainer();
  // const { navigate } = useNextLocation();

  const showPagination = total > limit;
  const showSortOptions = total > 1;
  const paginationState = computePaginationState({
    total,
    currentPageNumber: page,
    limit,
  });

  return (
    <div>
      {(showSortOptions || showPagination) && (
        <div className="flex space-x-4 justify-between flex-col md:flex-row mb-4">
          <div>
            {/* <MyDropdown /> */}
            {showSortOptions && (
              <SortOrderPicker
                value={sortOptionId as SortOptionKey}
                searchState={searchState}
              />
            )}
          </div>
          {showPagination && (
            <div>
              <TopPaginationControls
                paginationState={paginationState}
                buildPageURL={buildPageURL}
              />
            </div>
          )}
        </div>
      )}
      <ProjectTable
        projects={projects}
        buildPageURL={buildPageURL}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId={sortOptionId} />
        )}
      />
      {/* {showPagination && <BottomPaginationControls {...paginationState} />} */}
    </div>
  );
};

// function MyDropdown() {
//   return (
//     <Menu>
//       <Menu.Button>More</Menu.Button>
//       <Menu.Items>
//         <Menu.Item>
//           {({ active }) => (
//             <a
//               className={`${active && "bg-blue-500"}`}
//               href="/account-settings"
//             >
//               Account settings
//             </a>
//           )}
//         </Menu.Item>
//         <Menu.Item>
//           {({ active }) => (
//             <a
//               className={`${active && "bg-blue-500"}`}
//               href="/account-settings"
//             >
//               Documentation
//             </a>
//           )}
//         </Menu.Item>
//         <Menu.Item disabled>
//           <span className="opacity-75">Invite a friend (coming soon!)</span>
//         </Menu.Item>
//       </Menu.Items>
//     </Menu>
//   );
// }
