import React from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { ChangelogEntryType } from '@/data/changelogData';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface ChangelogPostCardProps {
  entry: ChangelogEntryType;
  month: string;
  year: string;
}
const ChangelogPostCard = ({
  entry,
  month,
  year
}: ChangelogPostCardProps) => {
  return <Card className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-300 my-[10px] py-[12px] mx-[182px]">
      <div className="flex flex-col p-6 px-[29px] mx-[70px]">
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
    </Card>;
};
export default ChangelogPostCard;