import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CareerSentenceContextType {
  selectedCareerSentence: string | null;
  setSelectedCareerSentence: (sentence: string | null) => void;
  loading: boolean;
}

const CareerSentenceContext = createContext<CareerSentenceContextType | undefined>(undefined);

const CAREER_SENTENCE_STORAGE_KEY = 'shared_career_sentence';

interface CareerSentenceProviderProps {
  children: ReactNode;
}

export const CareerSentenceProvider: React.FC<CareerSentenceProviderProps> = ({ children }) => {
  const [selectedCareerSentence, setSelectedCareerSentenceState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Supabase에서 사용자의 진로 문장 로드
  const loadCareerSentence = async () => {
    console.log('🎯 loadCareerSentence 호출됨');
    console.log('👤 user:', user);
    console.log('🆔 user.id:', user?.id);

    if (!supabase || !user) {
      console.log('❌ supabase 또는 user가 없음 - localStorage 사용');
      // 로그인하지 않은 경우 localStorage 사용
      try {
        const savedCareerSentence = localStorage.getItem(CAREER_SENTENCE_STORAGE_KEY);
        if (savedCareerSentence) {
          setSelectedCareerSentenceState(savedCareerSentence);
        }
      } catch (error) {
        console.error('Failed to load career sentence from localStorage:', error);
      }
      setLoading(false);
      return;
    }

    try {
      // 사용자의 가장 최근 진로 문장 조회
      const { data, error } = await supabase
        .from('sentences')
        .select('content, job, requirement')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('🔍 Supabase sentences 쿼리 결과:', { data, error });

      if (error) {
        console.error('Error loading career sentence:', error);
        // 에러 시 localStorage 폴백
        const savedCareerSentence = localStorage.getItem(CAREER_SENTENCE_STORAGE_KEY);
        if (savedCareerSentence) {
          setSelectedCareerSentenceState(savedCareerSentence);
        }
      } else if (data && data.length > 0) {
        const sentence = data[0];
        const fullSentence = `${sentence.job}${sentence.requirement ? ` ${sentence.requirement}` : ''}에 관심이 있어서, ${sentence.content}`;
        console.log('✅ 로드된 진로 문장:', fullSentence);
        setSelectedCareerSentenceState(fullSentence);
      } else {
        console.log('📭 저장된 진로 문장 없음');
        // Supabase에 데이터가 없으면 localStorage에서 마이그레이션
        const savedCareerSentence = localStorage.getItem(CAREER_SENTENCE_STORAGE_KEY);
        if (savedCareerSentence) {
          console.log('🔄 localStorage에서 마이그레이션:', savedCareerSentence);
          setSelectedCareerSentenceState(savedCareerSentence);
          // TODO: localStorage 데이터를 Supabase로 마이그레이션하는 로직 추가 가능
        }
      }
    } catch (error) {
      console.error('Failed to load career sentence from Supabase:', error);
      // 에러 시 localStorage 폴백
      try {
        const savedCareerSentence = localStorage.getItem(CAREER_SENTENCE_STORAGE_KEY);
        if (savedCareerSentence) {
          setSelectedCareerSentenceState(savedCareerSentence);
        }
      } catch (localError) {
        console.error('Failed to load career sentence from localStorage:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  // 사용자 변경 시 진로 문장 다시 로드
  useEffect(() => {
    loadCareerSentence();
  }, [user]);

  // 진로 문장 저장
  const saveCareerSentenceToSupabase = async (sentence: string) => {
    if (!supabase || !user) return false;

    try {
      // 기존 문장과 중복되지 않도록 간단한 파싱
      // "직업 요구사항에 관심이 있어서, 내용" 형태로 가정
      const match = sentence.match(/^(.+?)(\s.+?)?에 관심이 있어서,\s(.+)$/);
      
      let job = sentence;
      let requirement = null;
      let content = sentence;

      if (match) {
        job = match[1];
        requirement = match[2] ? match[2].trim() : null;
        content = match[3];
      }

      const { error } = await supabase
        .from('sentences')
        .insert({
          user_id: user.id,
          content: content,
          job: job,
          requirement: requirement
        });

      if (error) {
        console.error('Failed to save career sentence to Supabase:', error);
        return false;
      }

      console.log('✅ 진로 문장 Supabase에 저장 성공');
      return true;
    } catch (error) {
      console.error('Error saving career sentence to Supabase:', error);
      return false;
    }
  };

  // 진로 문장 설정
  const setSelectedCareerSentence = async (sentence: string | null) => {
    setSelectedCareerSentenceState(sentence);
    
    try {
      if (sentence) {
        // localStorage에 저장 (폴백용)
        localStorage.setItem(CAREER_SENTENCE_STORAGE_KEY, sentence);
        
        // 로그인한 경우 Supabase에도 저장
        if (user) {
          const saved = await saveCareerSentenceToSupabase(sentence);
          if (!saved) {
            toast.error('진로 문장 저장에 실패했습니다.');
          }
        }
      } else {
        // 문장 삭제
        localStorage.removeItem(CAREER_SENTENCE_STORAGE_KEY);
        // TODO: Supabase에서 삭제 로직도 필요시 추가
      }
    } catch (error) {
      console.error('Failed to save career sentence:', error);
    }
  };

  // 디버깅용 함수
  const clearCareerSentenceStorage = () => {
    localStorage.removeItem(CAREER_SENTENCE_STORAGE_KEY);
    setSelectedCareerSentenceState(null);
    console.log('🧹 진로 문장 localStorage 클리어됨');
    toast.info('진로 문장이 클리어되었습니다.');
  };

  // 테스트용 진로 문장 추가
  const addTestCareerSentence = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    const testSentence = `${user.email?.split('@')[0] || '사용자'}의 테스트 진로 문장 - ${Date.now()}`;
    await setSelectedCareerSentence(testSentence);
    toast.success('테스트 진로 문장이 추가되었습니다!');
  };

  // 개발용: 전역 함수로 노출
  if (typeof window !== 'undefined') {
    (window as any).clearCareerSentenceStorage = clearCareerSentenceStorage;
    (window as any).addTestCareerSentence = addTestCareerSentence;
  }

  return (
    <CareerSentenceContext.Provider 
      value={{ 
        selectedCareerSentence, 
        setSelectedCareerSentence,
        loading
      }}
    >
      {children}
    </CareerSentenceContext.Provider>
  );
};

export const useCareerSentence = () => {
  const context = useContext(CareerSentenceContext);
  if (!context) {
    throw new Error('useCareerSentence must be used within a CareerSentenceProvider');
  }
  return context;
};