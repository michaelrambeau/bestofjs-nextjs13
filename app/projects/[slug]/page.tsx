import { searchClient } from "~/backend";
import { ProjectHeader } from "../../components/project-details/project-header";
import { ReadmeCard } from "./project-readme/project-readme";

type PageProps = {
  params: {
    slug: string;
  };
};
export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = params;
  const project = await getData(slug);
  // const projectWithDetails = getProjectWithDetails(project, details);

  return (
    <div className="flex flex-col space-y-6">
      <ProjectHeader project={project} />
      {/* @ts-expect-error Server Component */}
      <ReadmeCard project={project} />
    </div>
  );
}

async function getData(projectSlug: string) {
  const project = await searchClient.getProjectBySlug(projectSlug);
  return project;
}
