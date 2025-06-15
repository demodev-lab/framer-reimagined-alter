import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
const TopicResultsCard = () => {
  return <Card>
      <CardContent className="p-6 flex flex-col gap-6">
        <Card>
          <CardContent className="p-4">
            <Button variant="secondary" size="sm" className="bg-gray-950 hover:bg-gray-800 text-slate-200">
              주제 1
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Button variant="secondary" size="sm">
              주제 2
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Button variant="secondary" size="sm">
              주제 3
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>;
};
export default TopicResultsCard;