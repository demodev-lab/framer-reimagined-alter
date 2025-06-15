
import React from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { ChangelogEntryType } from '@/data/changelogData';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChangelogPostCardProps {
  entry: ChangelogEntryType;
  month: string;
  year: string;
}

const ChangelogPostCard = ({ entry, month, year }: ChangelogPostCardProps) => {
  const imageUrl = `https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=800`;

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="md:w-1/3 shrink-0">
        <img src={imageUrl} alt={entry.title} className="h-48 w-full object-cover md:h-full" />
      </div>
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Alter" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">Changelog</p>
            <p className="text-sm text-muted-foreground">{`${month} ${year}`}</p>
          </div>
        </div>
        <CardTitle className="mb-2 text-xl">{entry.title}</CardTitle>
        <p className="text-muted-foreground flex-grow">{entry.description}</p>
      </div>
    </Card>
  );
};

export default ChangelogPostCard;
