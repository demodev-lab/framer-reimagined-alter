
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface TopicResultsCardProps {
  topics: string[];
  onSelectTopic: (topic: string) => void;
  isLoading: boolean;
}

const TopicResultsCard: React.FC<TopicResultsCardProps> = ({ topics, onSelectTopic, isLoading }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>탐구 주제 후보</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p>생성 중...</p>
          </div>
        ) : topics.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">왼쪽 카드에서 정보를 입력하고 '주제 생성' 버튼을 눌러주세요.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {topics.map((topic, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto whitespace-normal py-2"
                onClick={() => onSelectTopic(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicResultsCard;
