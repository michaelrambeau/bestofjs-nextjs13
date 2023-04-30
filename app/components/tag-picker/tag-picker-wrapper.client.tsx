"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { ProjectSearchQueryUpdater } from "~/projects/types";
import {
  parseSearchParams,
  ProjectPageSearchParams,
  stateToQueryString,
} from "../project-list/navigation-state";
import { TagPicker } from "./tag-picker.client";

type Props = {
  allTags: BestOfJS.Tag[];
};
export const TagPickerWrapper = ({ allTags }: Props) => {
  const router = useRouter();
  const urlSearchParams = useSearchParams()!;
  const projectSearchParams: ProjectPageSearchParams = {
    tags: urlSearchParams.getAll("tags") || undefined,
    query: urlSearchParams.get("query") || undefined,
    page: urlSearchParams.get("page") || undefined,
    sort: urlSearchParams.get("sort") || undefined,
    limit: urlSearchParams.get("limit") || undefined,
  };
  const searchState = parseSearchParams(projectSearchParams);

  const { tags } = searchState;

  const buildPageURL = (updater: ProjectSearchQueryUpdater) => {
    const nextState = updater(searchState);
    const queryString = stateToQueryString(nextState);
    return "/projects?" + queryString;
  };

  const onChangeTag = (values: string[]) => {
    const url = buildPageURL((state) => ({
      ...state,
      tags: values,
      page: 1,
    }));

    router.push(url);
  };

  return <TagPicker allTags={allTags} values={tags} onChange={onChangeTag} />;
};
