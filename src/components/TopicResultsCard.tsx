
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
const TopicResultsCard = () => {
  return <Card>
      <CardHeader>
        <CardTitle>Generated Topics</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex flex-col gap-4">
        <Card>
          <CardContent className="p-4">
            <Button variant="outline" size="sm" className="w-full justify-start font-light">
              주제 1
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Button variant="outline" size="sm" className="w-full justify-start font-light">
              주제 2
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Button variant="outline" size="sm" className="w-full justify-start font-light">
              주제 3
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>;
};
export default TopicResultsCard;
