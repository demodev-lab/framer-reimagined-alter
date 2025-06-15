
import Header from '@/components/Header';
import { changelogData } from '@/data/changelogData';
import ChangelogPostCard from '@/components/ChangelogPostCard';
import TopicGeneratorCard from '@/components/TopicGeneratorCard';
import TopicResultsCard from '@/components/TopicResultsCard';
import FeedbackCard from '@/components/FeedbackCard';

const Index = () => {
  const years = Object.keys(changelogData).sort((a, b) => Number(b) - Number(a));
  const allEntries = years.flatMap(year => Object.keys(changelogData[year]).flatMap(month => changelogData[year][month].map(entry => ({
    ...entry,
    year,
    month
  })))).sort((a, b) => new Date(`${b.month} 1, ${b.year}`).getTime() - new Date(`${a.month} 1, ${a.year}`).getTime());
  
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center py-16 md:py-[53px]">
          <span className="inline-block bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-xs font-medium mb-4">송쌤</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">학생부 제대로 준비하기</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">여러분의 학생부는 절대 '중구난방'이 되어서는 안됩니다.</p>
        </section>

        <section id="topic-generator" className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TopicGeneratorCard />
                <TopicResultsCard />
            </div>
        </section>

        <section id="how-to-prepare" className="py-12">
            <div className="flex flex-col gap-8">
                {allEntries.map(entry => <ChangelogPostCard key={entry.id} entry={entry} month={entry.month} year={entry.year} />)}
            </div>
        </section>

        <section id="feedback" className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-12">가장 빠른 피드백을 받아보세요</h2>
            <FeedbackCard />
        </section>
      </main>
    </div>
  );
};
export default Index;
