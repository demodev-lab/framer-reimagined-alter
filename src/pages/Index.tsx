import React, { useState } from 'react';
import Header from '@/components/Header';
import { changelogData } from '@/data/changelogData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangelogPostCard from '@/components/ChangelogPostCard';
import TopicGeneratorCard from '@/components/TopicGeneratorCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TopicResultsCard from '@/components/TopicResultsCard';

const Index = () => {
  const [topicGenerators, setTopicGenerators] = useState([{ id: 1 }]);
  const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddGenerator = () => {
    setTopicGenerators(prev => [...prev, { id: Date.now() }]);
  };

  const handleGenerate = (inputs: { subject: string; concept: string; careerPath: string; request: string; }) => {
    console.log("Generating topics with inputs:", inputs);
    if (!inputs.subject && !inputs.concept && !inputs.careerPath) {
      // Basic validation
      alert("교과 과목, 교과 개념, 진로 중 하나 이상을 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setGeneratedTopics([]);

    // Simulate API call to generate topics
    setTimeout(() => {
      setGeneratedTopics([
        `'${inputs.subject || '선택 과목'}'와 '${inputs.concept || '주요 개념'}'을(를) 활용한 '${inputs.careerPath || '희망 진로'}' 관련 탐구 주제`,
        `'${inputs.concept || '주요 개념'}'을 '${inputs.careerPath || '희망 진로'}' 분야에 적용하는 방안 연구`,
        `'${inputs.subject || '선택 과목'}' 심화 탐구: '${inputs.careerPath || '희망 진로'}'를 위한 제언`,
        `${inputs.request ? `요청사항(${inputs.request})을 반영한 ` : ''}맞춤형 탐구 주제 제안`
      ].filter(Boolean));
      setIsLoading(false);
    }, 1500);
  };

  const handleSelectTopic = (topic: string) => {
    console.log("Selected topic:", topic);
    // Further implementation for what happens after selection can be added here.
    alert(`선택된 주제: ${topic}`);
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
                <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    {topicGenerators.map(generator => (
                      <TopicGeneratorCard key={generator.id} onGenerate={handleGenerate} />
                    ))}
                    <Button variant="outline" className="w-full py-6" onClick={handleAddGenerator}>
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <TopicResultsCard 
                      topics={generatedTopics}
                      onSelectTopic={handleSelectTopic}
                      isLoading={isLoading}
                    />
                  </div>
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
