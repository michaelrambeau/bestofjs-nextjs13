import { searchClient } from "~/backend";
import { getHotProjectsRequest } from "~/backend-search-requests";
import { ProjectHeader } from "./project-header";
import { ProjectDetailsGitHubCard } from "./project-details-github/github-card";
import { ReadmeCard } from "./project-readme/project-readme";

type PageProps = {
  params: {
    slug: string;
  };
};
export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = params;
  const project = await getData(slug);

  return (
    <div className="flex flex-col space-y-8">
      <ProjectHeader project={project} />
      <ProjectDetailsGitHubCard project={project} />
      {/* @ts-expect-error Server Component */}
      <ReadmeCard project={project} />
    </div>
  );
}

async function getData(projectSlug: string) {
  const project = await searchClient.getProjectBySlug(projectSlug);
  return project;
}

export async function generateStaticParams() {
  const { projects: hotProjects } = await searchClient.findProjects(
    getHotProjectsRequest()
  );

  return hotProjects.map((project) => ({ slug: project.slug }));
}
