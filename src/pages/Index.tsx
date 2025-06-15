import React, { useState } from 'react';
import Header from '@/components/Header';
import { changelogData } from '@/data/changelogData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangelogPostCard from '@/components/ChangelogPostCard';
import TopicGeneratorCard from '@/components/TopicGeneratorCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TopicResultsCard from '@/components/TopicResultsCard';
import SelectedTopicCard from '@/components/SelectedTopicCard';

interface TopicRow {
  id: number;
  stage: 'initial' | 'topics_generated' | 'topic_selected';
  generatedTopics: string[];
  isLoadingTopics: boolean;
  selectedTopic: string | null;
  researchMethods: string[];
  isLoadingMethods: boolean;
}

const Index = () => {
  const [topicRows, setTopicRows] = useState<TopicRow[]>([
    {
      id: 1,
      stage: 'initial',
      generatedTopics: [],
      isLoadingTopics: false,
      selectedTopic: null,
      researchMethods: [],
      isLoadingMethods: false,
    },
  ]);

  const handleAddRow = () => {
    setTopicRows(prev => [
      ...prev,
      {
        id: Date.now(),
        stage: 'initial',
        generatedTopics: [],
        isLoadingTopics: false,
        selectedTopic: null,
        researchMethods: [],
        isLoadingMethods: false,
      },
    ]);
  };

  const handleGenerate = (rowId: number, inputs: { subject: string; concept: string; careerPath: string; request: string; }) => {
    console.log("Generating topics for row:", rowId, "with inputs:", inputs);
    if (!inputs.subject && !inputs.concept && !inputs.careerPath) {
      alert("교과 과목, 교과 개념, 진로 중 하나 이상을 입력해주세요.");
      return;
    }
    
    setTopicRows(prevRows => prevRows.map(row =>
      row.id === rowId ? { ...row, isLoadingTopics: true, generatedTopics: [] } : row
    ));

    setTimeout(() => {
      const newTopics = [
        `'${inputs.subject || '선택 과목'}'와 '${inputs.concept || '주요 개념'}'을(를) 활용한 '${inputs.careerPath || '희망 진로'}' 관련 탐구 주제`,
        `'${inputs.concept || '주요 개념'}'을 '${inputs.careerPath || '희망 진로'}' 분야에 적용하는 방안 연구`,
        `'${inputs.subject || '선택 과목'}' 심화 탐구: '${inputs.careerPath || '희망 진로'}'를 위한 제언`,
        `${inputs.request ? `요청사항(${inputs.request})을 반영한 ` : ''}맞춤형 탐구 주제 제안`
      ].filter(Boolean);

      setTopicRows(prevRows => prevRows.map(row =>
        row.id === rowId
          ? { ...row, isLoadingTopics: false, generatedTopics: newTopics, stage: 'topics_generated' }
          : row
      ));
    }, 1500);
  };

  const handleSelectTopic = (rowId: number, topic: string) => {
    console.log("Selected topic for row:", rowId, "topic:", topic);
    setTopicRows(prevRows => prevRows.map(row =>
      row.id === rowId ? { ...row, selectedTopic: topic, stage: 'topic_selected', isLoadingMethods: true, researchMethods: [] } : row
    ));

    setTimeout(() => {
      const methods = [
        `'${topic}'에 대한 문헌 연구 방법`,
        `'${topic}' 관련 설문조사 설계 및 분석`,
        `'${topic}'을 주제로 한 실험 계획 제안`,
      ];
      setTopicRows(prevRows => prevRows.map(row =>
        row.id === rowId ? { ...row, isLoadingMethods: false, researchMethods: methods } : row
      ));
    }, 1500);
  };

  const years = Object.keys(changelogData).sort((a, b) => Number(b) - Number(a));
  const allEntries = years.flatMap(year => Object.keys(changelogData[year]).flatMap(month => changelogData[year][month].map(entry => ({
    ...entry,
    year,
    month
  })))).sort((a, b) => new Date(`${b.month} 1, ${b.year}`).getTime() - new Date(`${a.month} 1, ${a.year}`).getTime());
  
  return <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center py-16 md:py-[53px]">
          <span className="inline-block bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-xs font-medium mb-4">송쌤</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">학생부 제대로 준비하기</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">여러분의 학생부는 절대 '중구난방'이 되어서는 안됩니다.</p>
        </section>

        <div className="flex flex-col items-center">
            <Tabs defaultValue="all-posts" className="w-full max-w-4xl px-[182px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all-posts">탐구 주제 만들기</TabsTrigger>
                <TabsTrigger value="changelog">학생부 준비 방법</TabsTrigger>
                <TabsTrigger value="announcements">빠른 피드백 받기</TabsTrigger>
              </TabsList>
              <TabsContent value="all-posts" className="-mx-[182px]">
                <div className="py-8 flex flex-col gap-8">
                  {topicRows.map((row) => (
                    <div key={row.id} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        {row.stage === 'topic_selected' ? (
                          <SelectedTopicCard topic={row.selectedTopic!} />
                        ) : (
                          <TopicGeneratorCard
                            onGenerate={(inputs) => handleGenerate(row.id, inputs)}
                          />
                        )}
                      </div>
                      <div>
                        {row.stage === 'topic_selected' ? (
                          <TopicResultsCard
                            title="탐구 방법"
                            placeholder="탐구 방법을 생성 중입니다..."
                            topics={row.researchMethods}
                            onSelectTopic={(method) => console.log('Method selected:', method)}
                            isLoading={row.isLoadingMethods}
                            isSelectable={false}
                          />
                        ) : (
                          <TopicResultsCard
                            title="탐구 주제 후보"
                            placeholder="'주제 생성' 버튼을 누르면 주제 후보 3개가 생성됩니다."
                            topics={row.generatedTopics}
                            onSelectTopic={(topic) => handleSelectTopic(row.id, topic)}
                            isLoading={row.isLoadingTopics}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full py-6" onClick={handleAddRow}>
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="announcements">
                <div className="py-8">
                  <div className="flex flex-col gap-8">
                    {allEntries.map(entry => <ChangelogPostCard key={entry.id} entry={entry} month={entry.month} year={entry.year} />)}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="changelog">
                <div className="py-8">
                  <div className="flex flex-col gap-8">
                    {allEntries.map(entry => <ChangelogPostCard key={entry.id} entry={entry} month={entry.month} year={entry.year} />)}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
        </div>
      </main>
    </div>;
};
export default Index;
