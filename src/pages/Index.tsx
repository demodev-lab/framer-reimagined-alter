import React from 'react';
import Header from '@/components/Header';
import { changelogData } from '@/data/changelogData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangelogPostCard from '@/components/ChangelogPostCard';
import TopicGeneratorCard from '@/components/TopicGeneratorCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TopicResultsCard from '@/components/TopicResultsCard';
import SelectedTopicCard from '@/components/SelectedTopicCard';
import { useTopicManager } from '@/hooks/useTopicManager';

const Index = () => {
  const {
    topicRows,
    handleAddRow,
    handleGenerate,
    handleSelectTopic,
    handleRefreshTopic,
    handleLockTopic,
    handleDeleteTopic,
    handleRegenerateMethods,
    handleTopicTypeChange,
  } = useTopicManager();

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
                  {topicRows.map((row, index) => (
                    <div key={row.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
                      <div>
                        {row.stage === 'topic_selected' ? (
                          <SelectedTopicCard
                            topic={row.selectedTopic!}
                            subject={row.subject}
                            concept={row.concept}
                            topicNumber={index + 1}
                            isLocked={row.isLocked}
                            onRefresh={() => handleRefreshTopic(row.id)}
                            onLock={() => handleLockTopic(row.id)}
                            onDelete={() => handleDeleteTopic(row.id)}
                            onRegenerateMethods={() => handleRegenerateMethods(row.id)}
                            topicType={row.topicType}
                            onTopicTypeChange={(type) => handleTopicTypeChange(row.id, type)}
                          />
                        ) : (
                          <TopicGeneratorCard
                            onGenerate={(inputs) => handleGenerate(row.id, inputs)}
                            initialValues={{
                              subject: row.subject,
                              concept: row.concept,
                              careerPath: row.careerPath,
                              request: row.request,
                              topicType: row.topicType,
                            }}
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
                            scrollable={true}
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
