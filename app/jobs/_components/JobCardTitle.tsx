import React from 'react';

interface JobTitleProps {
  titles: string[];
}

export const JobCardTitle: React.FC<JobTitleProps> = ({ titles }) => {
  const MAX_VISIBLE_TITLES = 2;

  const visibleTitles = titles.slice(0, MAX_VISIBLE_TITLES);
  const hiddenCount = titles.length - MAX_VISIBLE_TITLES;

  return (
    <div className="flex flex-wrap gap-2">
      <h1 className="text-lg font-bold text-primary2 leading-snug line-clamp-2">
        {visibleTitles.join(' - ')} {hiddenCount > 0 ? '...' : ''}
      </h1>

      {hiddenCount > 0 && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary2/10 text-primary2 w-fit">
          + {hiddenCount} وظائف أخرى
        </span>
      )}
    </div>
  );
};