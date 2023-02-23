import NextLink from "next/link";
import { GoFlame, GoGift } from "react-icons/go";

import { searchClient } from "./backend";
import {
  getHotProjectsRequest,
  getLatestProjects,
} from "./backend-search-requests";
import { SectionHeading } from "./components/core/section";
import {
  ProjectScore,
  ProjectTable,
} from "./components/project-list/project-table";
// import styles from './page.module.css'

export default async function Home() {
  const { hotProjects, newestProjects } = await getData();

  return (
    <>
      <h1 className="text-3xl mb-4">The best of JavaScript, HTML and CSS</h1>

      <SectionHeading
        icon={<GoFlame fontSize={32} />}
        title="Hot Projects"
        subtitle={
          <>
            by number of stars added <b>the last 24 hours</b>
          </>
        }
      />

      <HotProjectList projects={hotProjects} />

      <div className="mt-8">
        <SectionHeading
          icon={<GoGift fontSize={32} />}
          title="Recently Added Projects"
          subtitle={
            <>
              Latest additions to <i>Best of JS</i>
            </>
          }
        />
      </div>

      <NewestProjectList projects={newestProjects} />
    </>
  );
}

function HotProjectList({ projects }: { projects: BestOfJS.Project[] }) {
  return (
    <>
      <ProjectTable
        projects={projects}
        showDetails={false}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId="daily" />
        )}
        footer={
          <NextLink
            href={`/projects?sort=daily`}
            passHref
            className="btn btn-outline"
          >
            View full rankings »
          </NextLink>
        }
      />
    </>
  );
}

function NewestProjectList({ projects }: { projects: BestOfJS.Project[] }) {
  return (
    <>
      <ProjectTable
        projects={projects}
        showDetails={false}
        metricsCell={(project) => (
          <ProjectScore project={project} sortOptionId="total" />
        )}
        footer={
          <NextLink
            href={`/projects?sort=newest`}
            passHref
            className="btn btn-outline"
          >
            View more »
          </NextLink>
        }
      />
    </>
  );
}

async function getData() {
  const { projects: hotProjects } = await searchClient.findProjects(
    getHotProjectsRequest()
  );
  const { projects: newestProjects } = await searchClient.findProjects(
    getLatestProjects()
  );
  return { hotProjects, newestProjects };

  // const bestOfJSProject = await searchClient.findOne({
  //   full_name: "bestofjs/bestofjs-webui",
  // });

  // const { tags: popularTags } = await searchClient.findTags({
  //   sort: { counter: -1 },
  //   limit: 10,
  // });

  // return {
  //   hotProjects,
  //   newestProjects,
  //   bestOfJSProject,
  //   popularTags,
  // };
}
