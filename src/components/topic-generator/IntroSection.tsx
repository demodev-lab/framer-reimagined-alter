
import React from 'react';

const IntroSection = () => {
  return (
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
  );
};

export default IntroSection;
