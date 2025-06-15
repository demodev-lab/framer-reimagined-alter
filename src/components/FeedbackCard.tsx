
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const FeedbackCard = () => {
  return (
    <Card className="max-w-3xl mx-auto bg-secondary">
      <CardContent className="p-10 text-center">
        <p className="text-lg text-secondary-foreground mb-6">
          학생부 고민, 더 이상 혼자 하지 마세요. 송쌤이 직접 여러분의 학생부를 분석하고, 가장 효과적인 솔루션을 제공합니다.
        </p>
        <Button size="lg">피드백 받으러 가기</Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
