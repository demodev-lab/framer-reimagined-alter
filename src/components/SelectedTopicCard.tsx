
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface SelectedTopicCardProps {
  topic: string;
}

const SelectedTopicCard: React.FC<SelectedTopicCardProps> = ({ topic }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>선택된 주제</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center">
        <p className="text-lg font-semibold">{topic}</p>
      </CardContent>
    </Card>
  );
};

export default SelectedTopicCard;
