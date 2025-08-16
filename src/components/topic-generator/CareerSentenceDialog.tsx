import React from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import { CareerSentenceGroup } from '@/types/careerSentence';
import '@/styles/career-sentences.css';

interface CareerSentenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedCareerSentences: string[];
  careerSentenceGroups?: CareerSentenceGroup[]; // 새로운 선택적 prop
  isGeneratingCareerSentence: boolean;
  onGenerate: (data: {
    careerField: string;
    activity: string;
    file: File | null;
    aspiration: string;
  }) => void;
  onSelectCareerSentence: (sentence: string) => void;
}
const CareerSentenceDialog: React.FC<CareerSentenceDialogProps> = ({
  open,
  onOpenChange,
  generatedCareerSentences,
  careerSentenceGroups = [], // 기본값 설정
  isGeneratingCareerSentence,
  onGenerate,
  onSelectCareerSentence
}) => {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full p-0 bg-white">
        <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <DialogTitle className="sr-only">진로 문장 재생성</DialogTitle>
        <DialogDescription className="sr-only text-base">새로운 진로 문장을 생성합니다</DialogDescription>
        
        <div className="p-6">
          <p className="text-xl text-gray-600 mb-6">
            아래에서 새로운 진로 문장을 생성해주세요.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
            <div className="h-full">
              <CareerSentenceGeneratorCard onGenerate={onGenerate} />
            </div>
            
            <div className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>생성된 진로 문장</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden min-h-0">
                  {isGeneratingCareerSentence ? <div className="flex items-center justify-center h-full">
                      <p>진로 문장을 생성 중입니다...</p>
                    </div> : (careerSentenceGroups.length === 0 && generatedCareerSentences.length === 0) ? <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-center">
                        '문장 생성' 버튼을 누르면 진로 문장 후보 3개가 생성됩니다.
                      </p>
                    </div> : <div className="flex flex-col gap-4 h-full overflow-y-auto career-sentences-container">
                      {/* 새로운 누적 그룹 표시 */}
                      {careerSentenceGroups.length > 0 && careerSentenceGroups.map((group, groupIndex) => (
                        <div key={group.id} className="space-y-2">
                          {/* 그룹 헤더 */}
                          <div className="text-xs text-gray-400 border-b pb-1 flex justify-between items-center">
                            <span>생성 시간: {group.timestamp.toLocaleTimeString()}</span>
                            <span className="text-gray-500">#{groupIndex + 1}</span>
                          </div>
                          
                          {/* 문장들 */}
                          {group.sentences.map((sentence, sentenceIndex) => (
                            <Button 
                              key={`${group.id}-${sentenceIndex}`} 
                              variant="outline" 
                              className="justify-start text-left h-auto whitespace-normal py-3 px-4 hover:bg-green-50 hover:border-green-300 hover:text-green-800" 
                              onClick={() => onSelectCareerSentence(sentence)}
                            >
                              {sentence}
                            </Button>
                          ))}
                        </div>
                      ))}
                      
                      {/* 기존 로직 호환성 유지 (그룹이 없을 때만) */}
                      {careerSentenceGroups.length === 0 && generatedCareerSentences.map((sentence, index) => 
                        <Button key={index} variant="outline" className="justify-start text-left h-auto whitespace-normal py-3 px-4 hover:bg-green-50 hover:border-green-300 hover:text-green-800" onClick={() => onSelectCareerSentence(sentence)}>
                          {sentence}
                        </Button>
                      )}
                    </div>}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default CareerSentenceDialog;