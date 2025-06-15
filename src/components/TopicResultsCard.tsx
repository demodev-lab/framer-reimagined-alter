
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

interface TopicResultsCardProps {
  title: string;
  placeholder: string;
  topics: string[];
  onSelectTopic: (topic: string) => void;
  isLoading: boolean;
  isSelectable?: boolean;
  scrollable?: boolean;
}

const TopicResultsCard: React.FC<TopicResultsCardProps> = ({
  title,
  placeholder,
  topics,
  onSelectTopic,
  isLoading,
  isSelectable = true,
  scrollable = false,
}) => {
  const topicsList = (
    <div className="flex flex-col gap-2">
      {topics.map((topic, index) => (
        <Button
          key={index}
          variant="outline"
          className="justify-start text-left h-auto whitespace-normal py-2"
          onClick={() => isSelectable && onSelectTopic(topic)}
          disabled={!isSelectable}
        >
          {topic}
        </Button>
      ))}
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>생성 중...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">{placeholder}</p>
          </div>
        ) : scrollable ? (
          <ScrollArea className="h-full pr-4">{topicsList}</ScrollArea>
        ) : (
          topicsList
        )}
      </CardContent>
    </Card>
  );
};

export default TopicResultsCard;
