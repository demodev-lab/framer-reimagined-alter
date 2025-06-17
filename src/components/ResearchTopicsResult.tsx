
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, GraduationCap } from 'lucide-react';

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
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          탐구 주제 분석 결과
        </h2>
        <p className="text-gray-600">
          생활기록부에서 추출된 과목별 탐구 주제입니다
        </p>
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
                  <div className="flex items-center gap-2 mb-3">
                    <Book className="w-5 h-5 text-green-600" />
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
  );
};

export default ResearchTopicsResult;
