import React from "react";
import NextLink from "next/link";
// import { MdAdd } from "react-icons/md";
import { ProjectSearchQuery, SearchUrlBuilder } from "../../projects/types";

type Props = {
  tags: BestOfJS.Tag[];
  appendTag?: boolean;
  buildPageURL?: SearchUrlBuilder<ProjectSearchQuery>;
};
export const ProjectTagGroup = ({ tags, ...otherProps }: Props) => {
  return (
    <div className="flex flex-wrap -m-1">
      {tags.map((tag) => (
        <div key={tag.code} className="m-1">
          <ProjectTag tag={tag} {...otherProps} />
        </div>
      ))}
    </div>
  );
};

export const ProjectTag = ({
  tag,
  buildPageURL,
  appendTag,
}: {
  tag: BestOfJS.Tag;
  buildPageURL?: Props["buildPageURL"];
  appendTag?: boolean;
}) => {
  const url = buildPageURL
    ? buildPageURL((state) => ({
        ...state,
        tags: appendTag ? [...state.tags, tag.code] : [tag.code],
        page: 1,
      }))
    : `/projects?tags=${tag.code}`;

  return (
    <NextLink href={url} className="btn btn-sm normal-case">
      {tag.name}
    </NextLink>
  );
};
