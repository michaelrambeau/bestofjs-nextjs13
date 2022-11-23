import { Suspense } from "react";

import { ErrorBoundary } from "~/error-handling";
import "./readme.css";

export async function ReadmeCard({ project }: { project: BestOfJS.Project }) {
  return (
    <div className="border rounded-md bg-neutral-700">
      <div className="p-4 border-b">README</div>
      <div className="p-4 markdown-body">
        <ErrorBoundary fallback={<>Unable to load the project README</>}>
          <Suspense fallback={<>Loading README.md</>}>
            {/* @ts-expect-error Server Component */}
            <ReadmeContent project={project} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

async function ReadmeContent({ project }: { project: BestOfJS.Project }) {
  const html = await getData(project.full_name, project.branch);
  // if (error) return <div>Unable to fetch README.md content from GitHub</div>;

  // if (!html) return <Spinner />;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

async function getData(fullName: string, branch: string) {
  const url = `https://bestofjs-serverless.vercel.app/api/project-readme?fullName=${fullName}&branch=${branch}`;
  const html = await fetch(url).then((r) => r.text());
  return html;
}
