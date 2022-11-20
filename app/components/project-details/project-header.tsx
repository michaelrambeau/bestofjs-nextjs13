import { GoHome, GoMarkGithub } from "react-icons/go";
import { DiNpm } from "react-icons/di";

import formatUrl from "../../helpers/url";
import { ProjectTagGroup } from "../tags/project-tag";
import { ProjectAvatar } from "../core";
import React from "react";

type Props = { project: BestOfJS.Project };
export const ProjectHeader = ({ project }: Props) => {
  const { full_name, packageName, repository, url } = project;

  return (
    <div className="flex flex-col sm:flex-row mb-4 sm:divide-x sm:divide-dashed space-y-4 sm:space-y-0">
      <div className="flex items-center grow min-h-[120px]">
        <div className="pr-4">
          <ProjectAvatar project={project} size={75} />
        </div>
        <div className="flex flex-col space-y-4">
          <h2 className="text-4xl">{project.name}</h2>
          <div>{project.description}</div>
          <div>
            <ProjectTagGroup tags={project.tags} />
          </div>
        </div>
      </div>
      <aside className="sm:w-[280px] sm:pl-4 flex flex-col space-y-2">
        <ButtonLink href={repository} icon={<GoMarkGithub size={20} />}>
          {full_name}
        </ButtonLink>
        {url && (
          <ButtonLink href={url} icon={<GoHome size={20} />}>
            {formatUrl(url)}
          </ButtonLink>
        )}
        {packageName && (
          <ButtonLink
            href={`https://www.npmjs.com/package/${packageName}`}
            icon={
              <DiNpm
                size={28}
                className="icon"
                style={{ transform: "translateY(2px)" }}
              />
            }
          >
            {packageName}
          </ButtonLink>
        )}
      </aside>
    </div>
  );
};

const ButtonLink = ({
  href,
  icon,
  children,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <a
    href={href}
    className="btn btn-outline w-full normal-case justify-start relative"
  >
    <span className="absolute">{icon}</span>
    <span className="pl-[36px] overflow-hidden overflow-ellipsis whitespace-nowrap text-base">
      {children}
    </span>
  </a>
);
