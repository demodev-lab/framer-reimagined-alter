import React, { useState, useEffect } from "react";
import TopicGeneratorCard from "@/components/TopicGeneratorCard";
import TopicResultsCard from "@/components/TopicResultsCard";
import SelectedTopicCard from "@/components/SelectedTopicCard";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";
import { useTopicManager } from "@/hooks/useTopicManager";
import Header from "@/components/Header";
import CareerSentenceGeneratorCard from "@/components/CareerSentenceGeneratorCard";
import { Separator } from "@/components/ui/separator";

const TopicGenerator = () => {
  const {
    topicRows,
    handleAddRow,
    handleGenerate,
    handleSelectTopic,
    handleRefreshTopic,
    handleLockTopic,
    handleDeleteTopic,
    handleRegenerateMethods,
    handleTopicTypeChange
  } = useTopicManager();

  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isCareerSentenceLoading, setIsCareerSentenceLoading] = useState(false);
  const handleGenerateCareerSentence = (inputs: { careerField: string; activity: string; realization: string }) => {
    console.log("Generating career sentence with inputs:", inputs);
    setIsCareerSentenceLoading(true);
    setGeneratedCareerSentences([]);
    setTimeout(() => {
      const newSentences = [
        `'${inputs.careerField || '해당 진로'}' 분야에 대한 깊은 관심을 바탕으로, '${inputs.activity || '관련 활동'}'을 통해 '${inputs.realization || '중요한 점'}'라는 귀중한 깨달음을 얻음.`,
        `'${inputs.activity || '관련 활동'}' 경험은 '${inputs.careerField || '해당 진로'}'라는 진로 목표를 더욱 구체화하는 계기가 되었으며, 특히 '${inputs.realization || '중요한 점'}' 점이 인상적임.`,
        `자신의 진로인 '${inputs.careerField || '해당 진로'}'와 관련하여 '${inputs.activity || '관련 활동'}'을 주도적으로 수행하며 '${inputs.realization || '중요한 점'}'라는 점을 배우고 성장하는 모습을 보임.`
      ];
      setGeneratedCareerSentences(newSentences);
      setIsCareerSentenceLoading(false);
    }, 1500);
  };

  // 유튜브 영상 데이터 (실제 영상 ID로 교체해주세요)
  const videoData = [{
    id: "z4HfvrPA_kI",
    // 실제 유튜브 영상 ID로 교체
    title: "학생부 작성의 기초",
    description: "학생부 작성시 꼭 알아야 할 기본 원칙들"
  }, {
    id: "-Orv-jTXkSs",
    // 실제 유튜브 영상 ID로 교체
    title: "탐구 주제 선정 방법",
    description: "효과적인 탐구 주제를 찾는 방법"
  }, {
    id: "dQw4w9WgXcQ",
    // 실제 유튜브 영상 ID로 교체
    title: "학생부 세특 작성법",
    description: "세부능력 특기사항 작성 가이드"
  }];
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("preparation-method");
  useEffect(() => {
    const sections = ["preparation-method", "career-sentence-generator", "topic-generator-section"];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, {
      rootMargin: "-150px 0px -50% 0px"
    });
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);
  const navItems = [{
    id: "preparation-method",
    label: "학생부 준비 방법"
  }, {
    id: "career-sentence-generator",
    label: "진로 문장 생성기"
  }, {
    id: "topic-generator-section",
    label: "주제 생성기"
  }];
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
  return <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center py-16 md:py-[30px]">
          <span className="inline-block bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-xs font-medium mb-4">
            송쌤
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            탐구 주제 만들기
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            체계적인 탐구 주제 생성으로 학생부를 완성하세요.
          </p>
        </section>

        {/* Sticky Nav */}
        <div className="sticky top-[60px] z-40 bg-background/95 backdrop-blur-sm py-4 flex justify-center mb-12">
          <div className="p-1 bg-muted rounded-full flex items-center space-x-1 shadow-sm border">
            {navItems.map(item => <a key={item.id} href={`#${item.id}`} onClick={e => handleNavLinkClick(e, item.id)} className={`text-sm font-medium px-5 py-1.5 rounded-full transition-all duration-200 ${activeTab === item.id ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}`}>
                {item.label}
              </a>)}
          </div>
        </div>

        {/* 유튜브 영상 섹션 */}
        <section id="preparation-method" className="scroll-mt-[150px]">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-semibold">학생부 준비 방법</h2>
              </div>

              {/* 유튜브 영상 임베딩 */}
              <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-muted">
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoData[selectedVideoIndex].id}`} title={videoData[selectedVideoIndex].title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>

              {/* 영상 정보 */}
              <div className="mb-4">
                <h3 className="font-medium text-foreground">
                  {videoData[selectedVideoIndex].title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {videoData[selectedVideoIndex].description}
                </p>
              </div>

              {/* 영상 선택 라벨들 */}
              <div className="flex flex-wrap gap-2">
                {videoData.map((video, index) => <button key={index} onClick={() => setSelectedVideoIndex(index)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedVideoIndex === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {video.title}
                  </button>)}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto my-12">
          <Separator />
        </div>

        {/* 진로 문장 생성기 섹션 */}
        <section id="career-sentence-generator" className="flex flex-col items-center scroll-mt-[150px] mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              진로 문장 생성기
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-base text-muted-foreground">
              진로 문장을 통해 중구난방인 학생부를 막을 수 있습니다.
            </p>
          </div>
          <div className="w-full max-w-4xl px-[182px]">
            <div className="-mx-[182px]">
              <div className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
                  <div>
                    <CareerSentenceGeneratorCard onGenerate={handleGenerateCareerSentence} />
                  </div>
                  <div>
                    <TopicResultsCard
                      title="생성된 진로 문장"
                      placeholder="'문장 생성' 버튼을 누르면 진로 문장 3개가 생성됩니다."
                      topics={generatedCareerSentences}
                      onSelectTopic={() => {}}
                      isLoading={isCareerSentenceLoading}
                      isSelectable={false}
                      scrollable={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="topic-generator-section" className="flex flex-col items-center scroll-mt-[150px]">
          <div className="w-full max-w-4xl px-[182px]">
            <div className="-mx-[182px]">
              <div className="py-8 flex flex-col gap-8">
                {topicRows.map((row, index) => <div key={row.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
                    <div>
                      {row.stage === "topic_selected" ? <SelectedTopicCard topic={row.selectedTopic!} subject={row.subject} concept={row.concept} topicNumber={index + 1} isLocked={row.isLocked} onRefresh={() => handleRefreshTopic(row.id)} onLock={() => handleLockTopic(row.id)} onDelete={() => handleDeleteTopic(row.id)} onRegenerateMethods={() => handleRegenerateMethods(row.id)} topicType={row.topicType} onTopicTypeChange={type => handleTopicTypeChange(row.id, type)} /> : <TopicGeneratorCard onGenerate={inputs => handleGenerate(row.id, inputs)} initialValues={{
                    subject: row.subject,
                    concept: row.concept,
                    careerPath: row.careerPath,
                    request: row.request,
                    topicType: row.topicType
                  }} />}
                    </div>
                    <div>
                      {row.stage === "topic_selected" ? <TopicResultsCard title="탐구 방법" placeholder="탐구 방법을 생성 중입니다..." topics={row.researchMethods} onSelectTopic={method => console.log("Method selected:", method)} isLoading={row.isLoadingMethods} isSelectable={false} scrollable={true} /> : <TopicResultsCard title="탐구 주제 후보" placeholder="'주제 생성' 버튼을 누르면 주제 후보 3개가 생성됩니다." topics={row.generatedTopics} onSelectTopic={topic => handleSelectTopic(row.id, topic)} isLoading={row.isLoadingTopics} />}
                    </div>
                  </div>)}
                <Button variant="outline" className="w-full py-6" onClick={handleAddRow}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>;
};
export default TopicGenerator;
