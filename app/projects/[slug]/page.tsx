type PageProps = {
  params: {
    slug: string;
  };
};
export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = params;
  return <h1>{slug}</h1>;
}
