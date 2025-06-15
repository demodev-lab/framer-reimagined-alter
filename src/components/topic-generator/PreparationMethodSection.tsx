
import React, { useState } from 'react';

const videoData = [
  {
    id: "z4HfvrPA_kI",
    title: "학생부 작성의 기초",
    description: "학생부 작성시 꼭 알아야 할 기본 원칙들"
  },
  {
    id: "-Orv-jTXkSs",
    title: "탐구 주제 선정 방법",
    description: "효과적인 탐구 주제를 찾는 방법"
  },
  {
    id: "dQw4w9WgXcQ",
    title: "학생부 세특 작성법",
    description: "세부능력 특기사항 작성 가이드"
  }
];

const PreparationMethodSection = () => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  return (
    <section id="preparation-method" className="scroll-mt-[150px]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">학생부 준비 방법</h2>
        <p className="mt-3 max-w-xl mx-auto text-lg text-muted-foreground">
          영상 가이드를 통해 학생부 준비를 완벽하게 마스터하세요.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {videoData.map((video, index) => (
              <button
                key={index}
                onClick={() => setSelectedVideoIndex(index)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedVideoIndex === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {video.title}
              </button>
            ))}
          </div>

          <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-muted">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoData[selectedVideoIndex].id}`}
              title={videoData[selectedVideoIndex].title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-foreground">
              {videoData[selectedVideoIndex].title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {videoData[selectedVideoIndex].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreparationMethodSection;
