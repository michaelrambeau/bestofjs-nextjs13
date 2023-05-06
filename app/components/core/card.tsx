export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-lg border border-[var(--boxBorderColor)] bg-[var(--cardBackgroundColor)]">
      {children}
    </div>
  );
};

export const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-b border-[var(--boxBorderColor)] px-4 py-4">
      {children}
    </div>
  );
};

export const CardBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="divide-y divide-dashed">{children}</div>;
};

export const CardSection = ({ children }: { children: React.ReactNode }) => {
  return <div className="border-[var(--boxBorderColor)] p-4">{children}</div>;
};
