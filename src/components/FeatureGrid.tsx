
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Zap, 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";

const FeatureGrid = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('features');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI 기반 분석",
      description: "인공지능이 학생부 내용을 분석하여 개인별 맞춤 피드백을 제공합니다.",
      gradient: "from-purple-500 to-pink-500",
      delay: "delay-200"
    },
    {
      icon: Zap,
      title: "실시간 피드백",
      description: "즉시 피드백을 받아 학생부 작성 시간을 단축하고 품질을 향상시킵니다.",
      gradient: "from-blue-500 to-cyan-500",
      delay: "delay-400"
    },
    {
      icon: Target,
      title: "맞춤형 주제 생성",
      description: "개인의 관심사와 진로에 맞는 탐구 주제를 AI가 추천해드립니다.",
      gradient: "from-green-500 to-emerald-500",
      delay: "delay-600"
    },
    {
      icon: BookOpen,
      title: "체계적 관리",
      description: "모든 학생부 활동을 한 곳에서 체계적으로 관리하고 추적할 수 있습니다.",
      gradient: "from-orange-500 to-red-500",
      delay: "delay-800"
    },
    {
      icon: Users,
      title: "협업 지원",
      description: "교사, 학생, 학부모가 함께 소통하며 학생부를 완성해나갈 수 있습니다.",
      gradient: "from-indigo-500 to-purple-500",
      delay: "delay-1000"
    },
    {
      icon: TrendingUp,
      title: "성과 추적",
      description: "학습 성과와 성장 과정을 시각적으로 추적하고 분석할 수 있습니다.",
      gradient: "from-pink-500 to-rose-500",
      delay: "delay-1200"
    }
  ];

  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">핵심 기능</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            왜 탐구 연구소일까요?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AI 기술과 교육 전문성이 결합된 혁신적인 학생부 관리 솔루션
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 ${feature.delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <CardContent className="p-0">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
