
import React from "react";
import Header from "@/components/Header";
import { changelogData } from "@/data/changelogData";
import ChangelogPostCard from "@/components/ChangelogPostCard";

const Feedback = () => {
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
          <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-xs font-medium mb-4">
            <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="m12 1.25-10.75 6.25v12.5l10.75 6.25 10.75-6.25v-12.5z" fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" />
              <path d="m12 21.333-9.53125-5.5-1.21875-.75v-1.166l1.21875-.75 9.53125-5.5 9.5313 5.5 1.2187 0.75v1.1666l-1.2187.75z" fill="currentColor" />
              <path d="m1.25 7.5 10.75 6.25 10.75-6.25" stroke="var(--background)" stroke-linejoin="round" stroke-width="1.5" />
              <path d="m12 26.25v-12.5" stroke="var(--background)" stroke-linejoin="round" stroke-width="1.5" />
            </svg>
            <span className="font-medium">탐구 연구소</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">학생부 심폐 소생</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">늦었다고 생각했을 때가, 바로 마지막 기회입니다.</p>
        </section>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl px-[182px]">
            <div className="-mx-[182px]">
              <div className="py-8">
                <div className="flex flex-col gap-8">
                  {allEntries.map(entry => <ChangelogPostCard key={entry.id} entry={entry} month={entry.month} year={entry.year} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
