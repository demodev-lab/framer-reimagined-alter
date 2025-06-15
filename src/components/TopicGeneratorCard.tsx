
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const TopicGeneratorCard = () => {
  return (
    <Card className="flex flex-col">
      <CardContent className="p-6 flex flex-col flex-grow justify-between">
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm">
              교과 과목
            </Button>
            <p className="text-muted-foreground">입력 필요2</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm">
              교과 개념
            </Button>
            <p className="text-muted-foreground">입력 필요3</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm">
              요청 사항
            </Button>
            <p className="text-muted-foreground">(Option) 입력 필요4</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost">지우기</Button>
          <Button>주제 생성</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicGeneratorCard;
