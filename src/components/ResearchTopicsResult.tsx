import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Book, GraduationCap, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

interface SubjectTopic {
  subject: string;
  topics: string[];
}

interface GradeData {
  grade: number;
  subjects: SubjectTopic[];
}

interface ResearchTopicsResultProps {
  data: GradeData[];
}

const ResearchTopicsResult: React.FC<ResearchTopicsResultProps> = ({ data }) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [careerSentence, setCareerSentence] = useState("");
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);

  if (!data || data.length === 0) {
    return null;
  }

  const generateCareerSentence = () => {
    // 모든 탐구 주제를 수집
    const allTopics: string[] = [];
    data.forEach(gradeData => {
      gradeData.subjects.forEach(subject => {
        allTopics.push(...subject.topics);
      });
    });

    // 주요 키워드 추출 및 진로 문장 생성
    const keywords = extractKeywords(allTopics);
    const sentence = createCareerSentence(keywords);
    
    setCareerSentence(sentence);
    setRelatedTopics(allTopics);
    setIsDialogOpen(true);
  };

  const extractKeywords = (topics: string[]) => {
    // 탐구 주제에서 주요 키워드들을 추출하는 로직
    const keywordCount: { [key: string]: number } = {};
    
    topics.forEach(topic => {
      // 주요 키워드들을 추출 (실제로는 더 정교한 NLP 처리가 필요)
      const words = topic.match(/[가-힣]+/g) || [];
      words.forEach(word => {
        if (word.length >= 2) {
          keywordCount[word] = (keywordCount[word] || 0) + 1;
        }
      });
    });

    // 빈도순으로 정렬하여 상위 키워드 반환
    return Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
  };

  const createCareerSentence = (keywords: string[]) => {
    // 키워드를 바탕으로 진로 문장 생성
    const subjects = ["수학", "과학", "물리", "화학", "생명과학", "지구과학"];
    const activities = ["탐구", "실험", "연구", "분석", "관찰"];
    
    const mainSubjects = keywords.filter(keyword => 
      subjects.some(subject => keyword.includes(subject) || subject.includes(keyword))
    );
    
    const mainActivities = keywords.filter(keyword => 
      activities.some(activity => keyword.includes(activity) || activity.includes(keyword))
    );

    if (mainSubjects.length > 0 && mainActivities.length > 0) {
      return `${mainSubjects.slice(0, 2).join('과 ')} 분야의 ${mainActivities[0]}을 통해 ${keywords.slice(0, 3).join(', ')} 등의 주제에 깊은 관심을 보이며, 이를 바탕으로 관련 분야의 전문가가 되어 사회에 기여하고자 합니다.`;
    } else {
      return `다양한 탐구 활동을 통해 ${keywords.slice(0, 3).join(', ')} 등의 분야에 관심을 키워왔으며, 이러한 경험을 바탕으로 창의적이고 혁신적인 전문가로 성장하여 사회 발전에 기여하고자 합니다.`;
    }
  };

  const handleRegisterCareerSentence = () => {
    if (!careerSentence) {
      toast.error("진로 문장이 생성되지 않았습니다.");
      return;
    }

    // Save the career sentence to localStorage for the topic generator
    try {
      const savedState = localStorage.getItem('topic_manager_state');
      let state = savedState ? JSON.parse(savedState) : {};
      
      state.selectedCareerSentence = careerSentence;
      
      localStorage.setItem('topic_manager_state', JSON.stringify(state));
      
      toast.success("진로 문장이 등록되었습니다. 탐구 주제 생성 페이지로 이동합니다.");
      
      // Close dialog and navigate to topic generator
      setIsDialogOpen(false);
      navigate('/topic-generator');
    } catch (error) {
      console.error('Failed to save career sentence:', error);
      toast.error("진로 문장 등록에 실패했습니다.");
    }
  };

  const handleGenerateCareerSentence = () => {
    console.log("진로 문장 생성 버튼 클릭됨");
    generateCareerSentence();
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            탐구 주제 분석 결과
          </h2>
          <p className="text-gray-600">
            생활기록부에서 추출된 과목별 탐구 주제입니다
          </p>
          <div className="mt-4">
            <Button onClick={handleGenerateCareerSentence} className="bg-black text-white hover:bg-gray-800">
              <Sparkles className="w-4 h-4 mr-2" />
              진로 문장 생성
            </Button>
          </div>
        </div>

        {data.map((gradeData) => (
          <Card key={gradeData.grade} className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                {gradeData.grade}학년
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gradeData.subjects.map((subjectData, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {subjectData.subject}
                      </h3>
                    </div>
                    
                    <div className="space-y-1.5">
                      {subjectData.topics.length > 0 ? (
                        subjectData.topics.map((topic, topicIndex) => (
                          <Badge 
                            key={topicIndex} 
                            variant="secondary" 
                            className="block w-full p-2 text-left whitespace-normal h-auto"
                          >
                            {topic}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">
                          탐구 주제가 발견되지 않았습니다
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              진로 문장 생성 결과
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">생성된 진로 문장</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 leading-relaxed text-base">
                  {careerSentence}
                </p>
                
                {/* 진로 문장 결정 버튼 추가 */}
                <div className="mt-4 flex justify-center">
                  <Button 
                    onClick={handleRegisterCareerSentence}
                    className="bg-green-600 text-white hover:bg-green-700 px-6 py-2"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    진로 문장 결정
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  연관된 탐구 주제 ({relatedTopics.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                  {relatedTopics.map((topic, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="p-2 text-left whitespace-normal h-auto justify-start"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResearchTopicsResult;
