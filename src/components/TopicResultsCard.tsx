
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const TopicResultsCard = () => {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-6">
        <div className="space-y-2">
          <Button variant="secondary" size="sm">
            주제 1
          </Button>
          <Card className="h-24" />
        </div>
        <div className="space-y-2">
          <Button variant="secondary" size="sm">
            주제 2
          </Button>
          <Card className="h-24" />
        </div>
        <div className="space-y-2">
          <Button variant="secondary" size="sm">
            주제 3
          </Button>
          <Card className="h-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicResultsCard;
