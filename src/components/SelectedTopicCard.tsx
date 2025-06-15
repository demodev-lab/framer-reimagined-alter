
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface SelectedTopicCardProps {
  topic: string;
  subject: string;
  concept: string;
}

const SelectedTopicCard: React.FC<SelectedTopicCardProps> = ({ topic, subject, concept }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>선택된 주제</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <dl className="space-y-2">
          {subject && (
            <div className="flex">
              <dt className="w-20 font-semibold text-muted-foreground shrink-0">교과 과목</dt>
              <dd className="font-medium">{subject}</dd>
            </div>
          )}
          {concept && (
            <div className="flex">
              <dt className="w-20 font-semibold text-muted-foreground shrink-0">교과 개념</dt>
              <dd className="font-medium">{concept}</dd>
            </div>
          )}
        </dl>
        {(subject || concept) && <div className="border-t" />}
        <p className="text-lg font-semibold">{topic}</p>
      </CardContent>
    </Card>
  );
};

export default SelectedTopicCard;
