import { searchClient } from "~/backend";
import { TagPickerWrapper } from "../tag-picker/tag-picker-wrapper.client";

export async function SearchBox() {
  const { allTags } = await getData();
  return (
    <div className="w-full bg-gradient-to-r from-orange-600 to-orange-900">
      <div className="app-container py-4">
        <TagPickerWrapper allTags={allTags} />
      </div>
    </div>
  );
}

async function getData() {
  const { tags: allTags } = await searchClient.findTags({
    criteria: {},
    sort: { name: 1 },
    limit: 300,
    skip: 0,
    projection: {},
  });
  return { allTags };
}
