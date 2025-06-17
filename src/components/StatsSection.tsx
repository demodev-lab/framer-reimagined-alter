
import React, { useEffect, useState, useRef } from "react";
import { TrendingUp, Users, Award, Clock } from "lucide-react";

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    satisfaction: 0,
    topics: 0,
    time: 0
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounting();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCounting = () => {
    const targets = { users: 1500, satisfaction: 98, topics: 5000, time: 75 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounts({
        users: Math.floor(targets.users * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
        topics: Math.floor(targets.topics * progress),
        time: Math.floor(targets.time * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, stepDuration);
  };

  const stats = [
    {
      icon: Users,
      value: counts.users.toLocaleString(),
      suffix: "+",
      label: "활성 사용자",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Award,
      value: counts.satisfaction.toString(),
      suffix: "%",
      label: "사용자 만족도",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      value: counts.topics.toLocaleString(),
      suffix: "+",
      label: "생성된 탐구 주제",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      value: counts.time.toString(),
      suffix: "%",
      label: "시간 단축 효과",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            믿을 수 있는 성과
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            수많은 학생과 교사들이 검증한 실제 결과
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center group transition-all duration-1000 delay-${(index + 1) * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.gradient} p-4 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                {stat.value}{stat.suffix}
              </div>
              
              <div className="text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
