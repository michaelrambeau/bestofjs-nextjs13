type Props = {
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
  title: React.ReactNode;
};
export const PageHeading = ({ icon, subtitle, title }: Props) => {
  return (
    <div className="flex mb-4 items-center">
      {icon && <div className="pr-2 text-yellow-500">{icon}</div>}
      <div className="flex-grow">
        <h1 className="text-3xl">{title}</h1>
        {subtitle && (
          <div className="text-[var(--textSecondaryColor)] uppercase">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
