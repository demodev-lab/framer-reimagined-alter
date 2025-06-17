
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('testimonials');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: "김지훈",
      role: "고3 학생",
      content: "탐구 연구소 덕분에 학생부 작성이 정말 쉬워졌어요. AI가 제안해준 주제로 멋진 탐구 활동을 할 수 있었습니다.",
      rating: 5,
      avatar: "👨‍🎓"
    },
    {
      name: "이수연",
      role: "진로 상담 교사",
      content: "학생들의 학생부 관리가 체계적으로 이루어져서 상담할 때 훨씬 효율적입니다. 정말 유용한 도구예요.",
      rating: 5,
      avatar: "👩‍🏫"
    },
    {
      name: "박민서",
      role: "고2 학생",
      content: "피드백 기능이 정말 좋아요. 실시간으로 조언을 받을 수 있어서 학생부 품질이 많이 향상되었습니다.",
      rating: 5,
      avatar: "👩‍🎓"
    }
  ];

  return (
    <section id="testimonials" className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">사용자 후기</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            실제 사용자 경험
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            탐구 연구소를 사용하고 있는 학생과 교사들의 생생한 후기
          </p>
        </div>

        <div className="relative">
          <div className="flex overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`min-w-full transition-all duration-1000 transform ${
                  index === activeIndex 
                    ? 'translate-x-0 opacity-100' 
                    : index < activeIndex 
                      ? '-translate-x-full opacity-0' 
                      : 'translate-x-full opacity-0'
                } bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8`}
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                <CardContent className="p-0 text-center max-w-4xl mx-auto">
                  <Quote className="w-12 h-12 text-purple-400 mx-auto mb-8" />
                  
                  <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 font-medium">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-purple-300">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-purple-400 scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
