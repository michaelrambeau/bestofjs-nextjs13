import NextLink from "next/link";
import { ProjectAvatar } from "~/components/core";

type Props = {
  tags: BestOfJS.TagWithProjects[];
};
export const TagList = ({ tags }: Props) => {
  return (
    <>
      {tags.map((tag) => (
        <div
          key={tag.code}
          className="flex justify-between border-t border-gray-500 border-dashed w-full bg-neutral-700"
        >
          <div className="p-4">
            <NextLink
              href={`/projects?tags=${tag.code}`}
              className="text-orange-400 hover:text-orange-300 hover:underline"
            >
              {tag.name}
            </NextLink>
            <span className="ml-2">({tag.counter} projects)</span>
          </div>
          <div className="flex gap-4 items-center px-4">
            {tag.projects.map((project) => (
              <NextLink
                key={project.slug}
                href={`/projects/${project.slug}`}
                prefetch={false}
              >
                <ProjectAvatar project={project} size={32} />
              </NextLink>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
