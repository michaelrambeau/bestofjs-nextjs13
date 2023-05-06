import numeral from "numeral";
import { GoGitCommit, GoMarkGithub } from "react-icons/go";
import { MdGroup } from "react-icons/md";
import {
  getDeltaByDay,
  Card,
  CardHeader,
  CardBody,
  CardSection,
  StarDelta,
  StarIcon,
  StarTotal,
} from "~/components/core";
import { fromNow } from "~/helpers/from-now";
import { MonthlyTrendsChart } from "./monthly-trends-chart";

type Props = {
  project: BestOfJS.Project;
};
export const ProjectDetailsGitHubCard = ({ project }: Props) => {
  const { stars } = project;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div>
            <GoMarkGithub size={24} />
          </div>
          <div>GitHub</div>
          <StarTotal value={stars} />
        </div>
      </CardHeader>
      <CardBody>
        {/* @ts-expect-error Server Component */}
        <GitHubCardBody project={project} />
      </CardBody>
    </Card>
  );
};

async function GitHubCardBody({ project }: Props) {
  const projectWithDetails = await getProjectDetails(project);

  return (
    <>
      <CardSection>
        <GitHubData project={projectWithDetails} />
      </CardSection>
      <CardSection>
        <GitHubMonthlyTrends project={projectWithDetails} />
      </CardSection>
      <CardSection>
        <GitHubTrendsSummary project={projectWithDetails} />
      </CardSection>
    </>
  );
}

async function getProjectDetails(project: BestOfJS.Project) {
  const details = await fetchProjectDetailsData(project.full_name);
  return mergeProjectData(project, details);
}

async function fetchProjectDetailsData(fullName: string) {
  const url = `https://bestofjs-serverless.vercel.app/api/project-details?fullName=${fullName}`;
  return fetch(url).then((r) => r.json());
}

const GitHubData = ({ project }: { project: BestOfJS.ProjectDetails }) => {
  const {
    commit_count,
    contributor_count,
    created_at,
    full_name,
    pushed_at,
    repository,
  } = project;
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <a href={repository} target="_blank" rel="noreferrer">
          {full_name}
        </a>
      </div>
      <div>
        {created_at && (
          <>
            Created {fromNow(created_at)}, last commit {fromNow(pushed_at)}
          </>
        )}
      </div>
      <div className="flex gap-2">
        <MdGroup size={20} className="icon" />
        {formatNumber(contributor_count)} contributors
      </div>
      <div className="flex gap-2">
        {commit_count && (
          <>
            <GoGitCommit size={20} className="icon" />
            {formatNumber(commit_count)} commits
          </>
        )}
      </div>
    </div>
  );
};

const formatNumber = (number: number) => numeral(number).format("0,0");

function mergeProjectData(project: BestOfJS.Project, details: any) {
  const {
    npm,
    bundle,
    packageSize,
    description,
    github: { contributor_count, commit_count, created_at },
    timeSeries,
  } = details;

  return {
    ...project,
    description,
    timeSeries,
    commit_count,
    contributor_count,
    created_at,
    npm,
    bundle,
    packageSize,
  } as BestOfJS.ProjectDetails;
}

export const GitHubMonthlyTrends = ({
  project,
}: {
  project: BestOfJS.ProjectDetails;
}) => {
  const deltas = project.timeSeries?.monthly; // { year: number; month: number; delta: number }[];
  const results = deltas.map(({ year, month, delta }) => ({
    year,
    month,
    value: delta,
  }));
  return (
    <>
      <div className="mb-2">Stars added on GitHub, month by month</div>
      <MonthlyTrendsChart results={results} unit="stars" showPlusSymbol />
    </>
  );
};

type SummaryItem = {
  label: string;
  category: keyof BestOfJS.ProjectDetails["trends"];
};
const summaryItems: SummaryItem[] = [
  { label: "Yesterday", category: "daily" },
  { label: "Last week", category: "weekly" },
  { label: "Last month", category: "monthly" },
  { label: "Last 12 months", category: "yearly" },
];

const GitHubTrendsSummary = ({
  project,
}: {
  project: BestOfJS.ProjectDetails;
}) => {
  const { trends } = project;
  const items = summaryItems.filter(({ category }) => {
    const value = trends[category];
    return value !== undefined && value !== null;
  });

  return (
    <>
      {trends.weekly || trends.weekly === 0 ? (
        <div>
          <div className="mb-4">Stars added on GitHub, per day, on average</div>
          <div className="flex w-full flex-col sm:flex-row">
            {items.map((item, i) => (
              <MonthlyTrendsItem item={item} key={i} trends={trends} />
            ))}
          </div>
        </div>
      ) : (
        <OnlyYesterday trends={trends} />
      )}
    </>
  );
};

const OnlyYesterday = ({
  trends,
}: {
  trends: BestOfJS.ProjectDetails["trends"];
}) => {
  const value = trends.daily;
  if (value === 0) return <div>No star added on GitHub yesterday</div>;
  return value > 0 ? (
    <div style={{ display: "flex", alignItems: "center" }}>
      {value}
      <StarIcon /> added yesterday
    </div>
  ) : (
    <div>
      {value}
      <StarIcon /> lost yesterday
    </div>
  );
};

const MonthlyTrendsItem = ({
  item,
  trends,
}: {
  item: SummaryItem;
  trends: BestOfJS.ProjectDetails["trends"];
}) => {
  const { label, category } = item;
  const value = getDeltaByDay(category)({ trends });
  if (value === undefined) return null;
  return (
    <div className="mt-2 flex-1 justify-center text-center sm:mt-0">
      <div>{label}</div>
      <div className="flex justify-center">
        <StarDelta value={value} average={category !== "daily"} />
      </div>
    </div>
  );
};
