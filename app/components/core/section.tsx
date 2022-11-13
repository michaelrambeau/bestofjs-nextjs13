import React from "react";

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
};
export const SectionHeading = ({ icon, title, subtitle }: Props) => {
  return (
    <div className="flex mb-4 items-center">
      {icon && (
        <div className="pr-2 text-yellow-500">
          {icon}
        </div>
      )}
      <div className="flex-grow">
        <h2 className="text-2xl">
          {title}
        </h2>
        {subtitle && (
          <div className="text-[var(--textSecondaryColor)] uppercase">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
