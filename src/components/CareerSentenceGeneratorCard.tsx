
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface CareerSentenceGeneratorCardProps {
  onGenerate: (data: {
    careerField: string;
    activity: string;
    file: File | null;
    aspiration: string;
  }, webhookResponse?: string[]) => void;
}

const CareerSentenceGeneratorCard: React.FC<CareerSentenceGeneratorCardProps> = ({
  onGenerate
}) => {
  const [careerField, setCareerField] = useState("");
  const [request, setRequest] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [aspiration, setAspiration] = useState("");
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const navigate = useNavigate();

  // Dialog 내부에서 사용할 진로 문장 생성기 상태들
  const [dialogCareerField, setDialogCareerField] = useState("");
  const [dialogRequest, setDialogRequest] = useState("");
  const [dialogFile, setDialogFile] = useState<File | null>(null);
  const [dialogFileInputKey, setDialogFileInputKey] = useState(Date.now());
  const [dialogAspiration, setDialogAspiration] = useState("");

  const handleClear = () => {
    setCareerField("");
    setRequest("");
    setFile(null);
    setAspiration("");
    setFileInputKey(Date.now());
  };

  const handleDialogClear = () => {
    setDialogCareerField("");
    setDialogRequest("");
    setDialogFile(null);
    setDialogAspiration("");
    setDialogFileInputKey(Date.now());
  };

  const handleGenerateClick = async () => {
    // Just pass data to parent without API call (parent will handle API call)
    onGenerate({
      careerField,
      activity: request,
      file,
      aspiration
    });
  };

  const handleDialogGenerateClick = async () => {
    // Just pass data to parent without API call (parent will handle API call)
    onGenerate({
      careerField: dialogCareerField,
      activity: dialogRequest,
      file: dialogFile,
      aspiration: dialogAspiration
    });
    setIsVideoPopupOpen(false);
  };

  const handleRequestChange = (value: string) => {
    setRequest(value);
    setFile(null);
    setAspiration("");
    if (value === '이전 활동이 존재합니다.') {
      setFileInputKey(Date.now());
    }
  };

  const handleDialogRequestChange = (value: string) => {
    setDialogRequest(value);
    setDialogFile(null);
    setDialogAspiration("");
    if (value === '이전 활동이 존재합니다.') {
      setDialogFileInputKey(Date.now());
    }
  };

  const handleNavigateToFeedback = () => {
    setIsVideoPopupOpen(false);
    navigate('/feedback');
  };

  return <Card className="h-full flex flex-col relative">
      <CardHeader>
        <CardTitle>진로 문장 생성기</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">직업</Button>
            <Input placeholder="예) 생명공학자" value={careerField} onChange={e => setCareerField(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
              요청 사항
            </Button>
            <Select value={request} onValueChange={handleRequestChange}>
              <SelectTrigger>
                <SelectValue placeholder="요청 사항을 선택하세요." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="이전 활동이 존재합니다.">이전 활동이 존재합니다.</SelectItem>
                <SelectItem value="직업을 가진 후 하고 싶은 것이 있습니다.">직업을 가진 후 하고 싶은 것이 있습니다.</SelectItem>
                <SelectItem value="요청 사항 없음.">요청 사항 없음.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {request === '이전 활동이 존재합니다.' && <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">학생부</Button>
                <Input key={fileInputKey} type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="w-full" aria-label="학생부 업로드" />
            </div>}
          {request === '직업을 가진 후 하고 싶은 것이 있습니다.' && <div className="flex items-start gap-4">
                <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0 mt-2">
                    추가 입력
                </Button>
                <Textarea placeholder="직업을 가진 후 하고 싶은 것을 구체적으로 입력해주세요." value={aspiration} onChange={e => setAspiration(e.target.value)} className="flex-grow min-h-[100px]" />
            </div>}
        </div>
        <div className="flex justify-between items-center pt-6">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="default" 
                  className="font-bold"
                  onClick={() => setIsVideoPopupOpen(true)}
                >
                  2,3학년 클릭 🖱️
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>학생부에 이미 기록된 것이 있다면, 반드시 눌러주세요</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={isVideoPopupOpen} onOpenChange={setIsVideoPopupOpen}>
            <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>이미 학생부에 기록이 있다면 영상을 꼭 봐주세요!</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="aspect-video">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/z4HfvrPA_kI" title="학생부 작성 가이드" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg" />
                </div>
                <div className="flex justify-center">
                  <Button onClick={handleNavigateToFeedback} className="bg-primary hover:bg-primary/90">
                    학생부 심폐 소생하기
                  </Button>
                </div>

                {/* 진로 문장 생성기를 Dialog 아래쪽에 배치 */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">진로 문장 생성기</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">직업</Button>
                      <Input placeholder="예) 생명공학자" value={dialogCareerField} onChange={e => setDialogCareerField(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
                        요청 사항
                      </Button>
                      <Select value={dialogRequest} onValueChange={handleDialogRequestChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="요청 사항을 선택하세요." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="이전 활동이 존재합니다.">이전 활동이 존재합니다.</SelectItem>
                          <SelectItem value="직업을 가진 후 하고 싶은 것이 있습니다.">직업을 가진 후 하고 싶은 것이 있습니다.</SelectItem>
                          <SelectItem value="요청 사항 없음.">요청 사항 없음.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {dialogRequest === '이전 활동이 존재합니다.' && <div className="flex items-center gap-4">
                          <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">학생부</Button>
                          <Input key={dialogFileInputKey} type="file" onChange={e => setDialogFile(e.target.files ? e.target.files[0] : null)} className="w-full" aria-label="학생부 업로드" />
                      </div>}
                    {dialogRequest === '직업을 가진 후 하고 싶은 것이 있습니다.' && <div className="flex items-start gap-4">
                          <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0 mt-2">
                              추가 입력
                          </Button>
                          <Textarea placeholder="직업을 가진 후 하고 싶은 것을 구체적으로 입력해주세요." value={dialogAspiration} onChange={e => setDialogAspiration(e.target.value)} className="flex-grow min-h-[100px]" />
                      </div>}
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={handleDialogClear}>
                      지우기
                    </Button>
                    <Button onClick={handleDialogGenerateClick}>문장 생성</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClear}>
              지우기
            </Button>
            <Button onClick={handleGenerateClick}>문장 생성</Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};

export default CareerSentenceGeneratorCard;
