import React from 'react';

interface JobTitleProps {
  titles: string[];
}

/**
 * Card title for a job ad. Many source posts bundle several roles in one
 * ad, so only the primary role is shown (full words, up to two lines) and
 * the rest collapse into a count chip instead of being chopped mid-word.
 */
export const JobCardTitle: React.FC<JobTitleProps> = ({ titles }) => {
  const [primaryTitle, ...otherTitles] = titles;

  if (!primaryTitle) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="text-lg font-bold text-primary leading-snug line-clamp-2">
        {primaryTitle}
      </h2>

      {otherTitles.length > 0 && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary w-fit">
          + {otherTitles.length} وظائف أخرى ضمن نفس الإعلان
        </span>
      )}
    </div>
  );
};
