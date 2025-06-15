
import Header from '@/components/Header';
import ChangelogSidebar from '@/components/ChangelogSidebar';
import ChangelogEntry from '@/components/ChangelogEntry';
import { changelogData } from '@/data/changelogData';

const Index = () => {
  const years = Object.keys(changelogData).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          <ChangelogSidebar />
          <main className="flex-1 py-12 lg:pl-8">
            <div className="space-y-16">
              {years.map(year => 
                Object.keys(changelogData[year]).map(month => (
                  <section key={`${year}-${month}`} id={`${year}-${month}`} className="scroll-mt-24">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">
                      {month} {year}
                    </h2>
                    <div className="space-y-12">
                      {changelogData[year][month].map(entry => (
                        <ChangelogEntry key={entry.id} entry={entry} />
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
