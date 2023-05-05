import React from "react";
import NextLink from "next/link";

// import {
//   DoubleChevronLeftIcon,
//   DoubleChevronRightIcon,
//   ChevronRightIcon,
//   ChevronLeftIcon,
// } from "../icons";
import { PaginationState } from "./pagination-state";
import { PaginationProps, SearchUrlBuilder } from "../../../projects/types";

// const iconSize = 28;

type Props<T> = {
  paginationState: PaginationState;
  buildPageURL: SearchUrlBuilder<T>;
};
export const TopPaginationControls = <T extends PaginationProps>(
  props: Props<T>
) => {
  const { paginationState, buildPageURL } = props;
  const { from, to, total, hasPreviousPage, hasNextPage } = paginationState;

  const previousPageURL = buildPageURL(
    (state: T) =>
      ({
        ...state,
        page: state.page - 1,
      } as T)
  );
  const nextPageURL = buildPageURL((state: T) => ({
    ...state,
    page: state.page + 1,
  }));

  return (
    <div className="flex items-center">
      <div className="mr-4">
        Showing{" "}
        {from === to ? (
          `#${from}`
        ) : (
          <>
            {from} - {to} of {total}
          </>
        )}
      </div>
      <div className="btn-group grid grid-cols-2">
        <PaginationButton href={previousPageURL} isDisabled={!hasPreviousPage}>
          Prev
        </PaginationButton>
        <PaginationButton href={nextPageURL} isDisabled={!hasNextPage}>
          Next
        </PaginationButton>
      </div>
    </div>
  );
};

function PaginationButton({
  href,
  isDisabled,
  children,
}: {
  href: string;
  isDisabled: boolean;
  children: React.ReactNode;
}) {
  return !isDisabled ? (
    <NextLink href={href} className="btn btn-outline">
      {children}
    </NextLink>
  ) : (
    <button disabled className="btn btn-outline btn-disabled">
      {children}
    </button>
  );
}

// export const BottomPaginationControls = (props: PaginationState) => {
//   const {
//     currentPageNumber,
//     hasPreviousPage,
//     hasNextPage,
//     lastPageNumber,
//     pageNumbers,
//   } = props;
//   const { previousPageURL, nextPageURL, firstPageURL, lastPageURL } =
//     usePaginationURL(props);
//   return (
//     <div className="mt-8 w-full justify-end">
//       {pageNumbers.length > 2 && (
//         <PaginationLink
//           href={firstPageURL}
//           isDisabled={currentPageNumber === 1}
//           icon={<DoubleChevronLeftIcon size={iconSize} />}
//           aria-label="First page"
//         />
//       )}

//       <PaginationLink
//         href={previousPageURL}
//         isDisabled={!hasPreviousPage}
//         icon={<ChevronLeftIcon size={iconSize} />}
//         aria-label="Previous"
//       />

//       <PaginationLink
//         href={nextPageURL}
//         isDisabled={!hasNextPage}
//         icon={<ChevronRightIcon size={iconSize} />}
//         aria-label="Next"
//       />

//       {pageNumbers.length > 2 && (
//         <PaginationLink
//           href={lastPageURL}
//           isDisabled={currentPageNumber === lastPageNumber}
//           icon={<DoubleChevronRightIcon size={iconSize} />}
//           aria-label="Last"
//         />
//       )}
//     </div>
//   );
// };

// const PaginationLink = ({ href, ...props }: { href: string | UrlObject }) => {
//   return href ? (
//     <NextLink href={href} passHref>
//       <IconButton isRound {...props} />
//     </NextLink>
//   ) : (
//     <IconButton isRound {...props} />
//   );
// };
