import Header from '@/components/Header';
import { changelogData } from '@/data/changelogData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangelogPostCard from '@/components/ChangelogPostCard';
const Index = () => {
  const years = Object.keys(changelogData).sort((a, b) => Number(b) - Number(a));
  const allEntries = years.flatMap(year => Object.keys(changelogData[year]).flatMap(month => changelogData[year][month].map(entry => ({
    ...entry,
    year,
    month
  })))).sort((a, b) => new Date(`${b.month} 1, ${b.year}`).getTime() - new Date(`${a.month} 1, ${a.year}`).getTime());
  return <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center py-16 md:py-[50px]">
          <span className="inline-block bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-xs font-medium mb-4">송쌤</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">학생부 제대로 준비하기</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">여러분의 학생부는 절대 '중구난방'이 되어서는 안됩니다.</p>
        </section>

        <div className="flex flex-col items-center">
            <Tabs defaultValue="changelog" className="w-full max-w-4xl px-[182px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all-posts">All Posts</TabsTrigger>
                <TabsTrigger value="changelog">Changelog</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>
              <TabsContent value="all-posts">
                <div className="text-center py-20 text-muted-foreground">
                  All posts will be displayed here.
                </div>
              </TabsContent>
              <TabsContent value="announcements">
                <div className="text-center py-20 text-muted-foreground">
                  Announcements will be displayed here.
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