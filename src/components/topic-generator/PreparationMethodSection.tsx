import React, { useState } from 'react';
const videoData = [{
  id: "z4HfvrPA_kI",
  title: "학생부 작성의 기초",
  description: "학생부 작성시 꼭 알아야 할 기본 원칙들"
}, {
  id: "-Orv-jTXkSs",
  title: "탐구 주제 선정 방법",
  description: "효과적인 탐구 주제를 찾는 방법"
}, {
  id: "dQw4w9WgXcQ",
  title: "학생부 세특 작성법",
  description: "세부능력 특기사항 작성 가이드"
}];
const PreparationMethodSection = () => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  return <section id="preparation-method" className="scroll-mt-[150px]">
      <div className="text-center mb-12">
        
        
      </div>
      <div className="max-w-3xl mx-auto">
        
      </div>
    </section>;
};
export default PreparationMethodSection;