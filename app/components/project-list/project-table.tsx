import numeral from "numeral";
import NextLink from "next/link";
import { GoMarkGithub, GoHome } from "react-icons/go";

import {
  ProjectAvatar,
  getDeltaByDay,
  DownloadCount,
  StarDelta,
  StarTotal,
} from "../core";
import { fromNow } from "../../helpers/from-now";
import { ProjectTagGroup } from "../tags/project-tag";
import { ProjectUrlBuilder } from "../../projects/types";

type Props = {
  projects: BestOfJS.Project[];
  buildPageURL?: ProjectUrlBuilder;
  footer?: React.ReactNode;
  metricsCell?: (project: BestOfJS.Project) => React.ReactNode;
  showDetails?: boolean;
};

export const ProjectTable = ({ projects, footer, ...otherProps }: Props) => {
  return (
    <div className="table-container">
      <table className="w-full">
        <tbody className="bg-neutral-800">
          {projects.map((project) => {
            if (!project) return null;
            return (
              <ProjectTableRow
                key={project.full_name}
                project={project}
                {...otherProps}
              />
            );
          })}
        </tbody>
        {footer && (
          <tfoot className="bg-neutral-800">
            <tr>
              <Cell colSpan={5} className="text-center py-4">
                {footer}
              </Cell>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

type RowProps = Pick<Props, "buildPageURL" | "metricsCell" | "showDetails"> & {
  project: BestOfJS.Project;
};
const ProjectTableRow = ({
  project,
  buildPageURL,
  showDetails = true,
  metricsCell,
}: RowProps) => {
  const path = `/projects/${project.slug}`;

  return (
    <tr data-testid="project-card">
      <Cell className="w-[50px] p-4">
        <NextLink href={path}>
          <ProjectAvatar project={project} size={48} />
        </NextLink>
      </Cell>

      <Cell className="w-auto pl-4 md:pl-2 py-4">
        <div className="relative flex items-center space-x-2">
          <NextLink href={path} className="link link-hover">
            {project.name}
          </NextLink>
          <div className="flex space-x-1">
            <a
              href={project.repository}
              aria-label="GitHub repository"
              rel="noopener noreferrer"
              target="_blank"
              className="btn btn-circle btn-ghost w-10 h-10 min-h-[2.5rem]"
            >
              <GoMarkGithub size={24} />
            </a>
            {project.url && (
              <a
                href={project.url}
                aria-label="Project's homepage"
                rel="noopener noreferrer"
                target="_blank"
                className="btn btn-circle btn-ghost w-10 h-10 min-h-[2.5rem]"
              >
                <GoHome size={24} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-2 text-sm mb-3">
          {project.description}
          <div className="sm mt-2 md:hidden">
            Updated {fromNow(project.pushed_at)},{" "}
            {formatNumber(project.contributor_count)} contributors
          </div>
        </div>
        <div>
          <ProjectTagGroup tags={project.tags} buildPageURL={buildPageURL} />
        </div>
      </Cell>

      {showDetails && (
        <Cell className="hidden w-[180px] text-sm md:table-cell p-4 space-y-2">
          <div>Pushed {fromNow(project.pushed_at)}</div>
          {project.contributor_count && (
            <div>{formatNumber(project.contributor_count)} contributors</div>
          )}
          <div>Created {fromNow(project.created_at)}</div>
        </Cell>
      )}

      {metricsCell && (
        <Cell className="w-[85px] text-center">{metricsCell(project)}</Cell>
      )}
    </tr>
  );
};

export const ProjectScore = ({
  project,
  sortOptionId,
}: {
  project: BestOfJS.Project;
  sortOptionId: string;
}) => {
  const showDelta = ["daily", "weekly", "monthly", "yearly"].includes(
    sortOptionId
  );
  const showDownloads = sortOptionId === "monthly-downloads";

  if (showDelta) {
    const value = getDeltaByDay(sortOptionId)(project);
    if (value === undefined) return null;
    return <StarDelta average={sortOptionId !== "daily"} value={value} />;
  }

  if (showDownloads) {
    return <DownloadCount value={project.downloads} />;
  }

  return <StarTotal value={project.stars} />;
};

const Cell = ({ className, ...props }: { className: string } & any) => (
  <td
    className={`border-t border-gray-500 border-dashed ${className}`}
    {...props}
  />
);

const formatNumber = (number: number) => numeral(number).format("a");
