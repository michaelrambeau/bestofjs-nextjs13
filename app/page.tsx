import Image from "next/image";
import NextLink from "next/link";
import { GoFlame } from "react-icons/go";
import { createSearchClient } from "./backend";
import { SectionHeading } from "./components/core/section";
import {
  ProjectScore,
  ProjectTable,
} from "./components/project-list/project-table";
// import styles from './page.module.css'

export default async function Home() {
  const { hotProjects } = await getData();
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
    </>
  );
}

function HotProjectList({ projects }:{projects: BestOfJS.Project[]}) {
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

async function getData() {
  const searchClient = createSearchClient();
  const { projects: hotProjects } = await searchClient.findProjects({
    criteria: {
      tags: { $nin: ["meta", "learning"] },
    },
    sort: {
      "trends.daily": -1,
    },
    limit: 5,
  });
  return { hotProjects };
  // const { projects: hotProjects } = await searchClient.findProjects({
  //   criteria: {
  //     tags: { $nin: ["meta", "learning"] },
  //   },
  //   sort: {
  //     "trends.daily": -1,
  //   },
  //   limit: 5,
  // });

  // const { projects: newestProjects } = await searchClient.findProjects({
  //   criteria: {},
  //   limit: 5,
  // });

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
