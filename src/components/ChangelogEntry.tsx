
import React from 'react';
import { ChangelogEntryType } from '@/data/changelogData';
import { cn } from '@/lib/utils';

interface ChangelogEntryProps {
  entry: ChangelogEntryType;
}

const tagColors = {
  New: 'bg-tag-new text-tag-new-foreground',
  Improvement: 'bg-tag-improvement text-tag-improvement-foreground',
  Fix: 'bg-tag-fix text-tag-fix-foreground',
};

const ChangelogEntry = ({ entry }: ChangelogEntryProps) => {
  const { type, version, title, description } = entry;
  const tagColor = tagColors[type] || 'bg-gray-500 text-white';

  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1 h-full w-px bg-border"></div>
      <div className="absolute left-[-4.5px] top-1.5 h-3 w-3 rounded-full bg-border"></div>
      <div className="flex items-center gap-4 mb-2">
        <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", tagColor)}>
          {type}
        </span>
        <span className="text-sm text-muted-foreground">{version}</span>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default ChangelogEntry;
