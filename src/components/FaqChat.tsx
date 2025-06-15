
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const FaqChat = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full shadow-lg"
        >
          <MessageCircle className="h-8 w-8" />
          <span className="sr-only">Open FAQ</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>자주 묻는 질문 (FAQ)</DrawerTitle>
          <DrawerDescription>
            궁금한 점이 있으신가요? 자주 묻는 질문들을 확인해보세요.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Q: 이 서비스는 어떻게 사용하나요?</h4>
              <p className="text-sm text-muted-foreground">
                A: 탐구 주제 생성, 빠른 피드백 기능을 통해 학생부를 체계적으로 관리할 수 있습니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Q: 비용은 어떻게 되나요?</h4>
              <p className="text-sm text-muted-foreground">
                A: 현재는 모든 기능이 무료로 제공됩니다. 추후 유료 플랜이 추가될 수 있습니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Q: 피드백은 누가 해주나요?</h4>
              <p className="text-sm text-muted-foreground">
                A: 입시 전문가와 AI가 함께 여러분의 학생부 내용을 분석하여 피드백을 제공합니다.
              </p>
            </div>
          </div>
        </div>
        <DrawerFooter className="pt-4">
          <DrawerClose asChild>
            <Button variant="outline">닫기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FaqChat;
