import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CareerSentenceContextType {
  selectedCareerSentence: string | null;
  setSelectedCareerSentence: (sentence: string | null) => void;
}

const CareerSentenceContext = createContext<CareerSentenceContextType | undefined>(undefined);

const CAREER_SENTENCE_STORAGE_KEY = 'shared_career_sentence';

interface CareerSentenceProviderProps {
  children: ReactNode;
}

export const CareerSentenceProvider: React.FC<CareerSentenceProviderProps> = ({ children }) => {
  const [selectedCareerSentence, setSelectedCareerSentenceState] = useState<string | null>(null);

  // localStorage에서 상태 로드
  useEffect(() => {
    try {
      const savedCareerSentence = localStorage.getItem(CAREER_SENTENCE_STORAGE_KEY);
      if (savedCareerSentence) {
        setSelectedCareerSentenceState(savedCareerSentence);
      }
    } catch (error) {
      console.error('Failed to load career sentence from localStorage:', error);
    }
  }, []);

  // 진로 문장 설정 시 localStorage에 저장
  const setSelectedCareerSentence = (sentence: string | null) => {
    setSelectedCareerSentenceState(sentence);
    try {
      if (sentence) {
        localStorage.setItem(CAREER_SENTENCE_STORAGE_KEY, sentence);
      } else {
        localStorage.removeItem(CAREER_SENTENCE_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save career sentence to localStorage:', error);
    }
  };

  return (
    <CareerSentenceContext.Provider value={{ selectedCareerSentence, setSelectedCareerSentence }}>
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