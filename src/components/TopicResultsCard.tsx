
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface TopicResultsCardProps {
  title: string;
  placeholder: string;
  topics: string[];
  onSelectTopic: (topic: string) => void;
  isLoading: boolean;
  isSelectable?: boolean;
}

const TopicResultsCard: React.FC<TopicResultsCardProps> = ({
  title,
  placeholder,
  topics,
  onSelectTopic,
  isLoading,
  isSelectable = true,
}) => {
  return <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <div className="flex items-center justify-center py-8">
            <p>생성 중...</p>
          </div> : topics.length === 0 ? <p className="text-muted-foreground text-center py-8">{placeholder}</p> : <div className="flex flex-col gap-2">
            {topics.map((topic, index) => <Button key={index} variant="outline" className="justify-start text-left h-auto whitespace-normal py-2" onClick={() => isSelectable && onSelectTopic(topic)} disabled={!isSelectable}>
                {topic}
              </Button>)}
          </div>}
      </CardContent>
    </Card>;
};

export default TopicResultsCard;
