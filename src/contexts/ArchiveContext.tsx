import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ArchivedTopic } from '@/types/archive';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ArchiveContextType {
  archivedTopics: ArchivedTopic[];
  saveTopic: (topic: Omit<ArchivedTopic, 'id' | 'createdAt' | 'status' | 'priority'>) => Promise<void>;
  updateTopicStatus: (id: string, status: ArchivedTopic['status']) => Promise<void>;
  updateTopicPriority: (id: string, priority: ArchivedTopic['priority']) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  loading: boolean;
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export const useArchive = () => {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
};

interface ArchiveProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'archived_topics';

export const ArchiveProvider: React.FC<ArchiveProviderProps> = ({ children }) => {
  const [archivedTopics, setArchivedTopics] = useState<ArchivedTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Supabase에서 사용자의 topics 로드
  const loadTopics = async () => {
    console.log('🔍 loadTopics 호출됨');
    console.log('📊 supabase:', !!supabase);
    console.log('👤 user:', user);
    console.log('🆔 user.id:', user?.id);

    if (!supabase || !user) {
      console.log('❌ supabase 또는 user가 없음');
      setArchivedTopics([]);
      setLoading(false);
      return;
    }

    try {
      // 먼저 모든 topics를 조회해서 디버깅 (RLS 우회)
      const { data: allTopics, error: allError } = await supabase
        .from('topics')
        .select('id, user_id, title, created_at')
        .limit(10);
      
      console.log('🔍 모든 topics (RLS 무시):', allTopics);
      console.log('🔍 모든 topics 에러:', allError);

      // 정상 쿼리 (RLS 적용)
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          research_methods (
            content,
            index
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('🔍 Supabase 쿼리 결과:', { data, error });
      console.log('📊 조회된 데이터 개수:', data?.length || 0);

      if (error) throw error;

      // 데이터 변환
      const transformedTopics: ArchivedTopic[] = (data || []).map(topic => ({
        id: topic.id,
        topic: topic.title,
        subject: topic.topic_type || '',
        researchMethods: topic.research_methods
          ?.sort((a: any, b: any) => a.index - b.index)
          .map((method: any) => method.content) || [],
        createdAt: new Date(topic.created_at),
        status: topic.status || 'Todo',
        priority: topic.priority || 'Medium',
        isLocked: topic.is_locked || false
      }));

      console.log('✅ 변환된 topics:', transformedTopics);
      setArchivedTopics(transformedTopics);

      // localStorage 마이그레이션은 일시적으로 비활성화
      // await migrateFromLocalStorage();
    } catch (error) {
      console.error('Failed to load topics:', error);
      toast.error('주제를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // localStorage에서 Supabase로 데이터 마이그레이션
  const migrateFromLocalStorage = async () => {
    console.log('🔄 마이그레이션 시작');
    if (!user || !supabase) {
      console.log('❌ 마이그레이션 실패: user 또는 supabase 없음');
      return;
    }

    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      console.log('📦 localStorage 데이터:', localData);
      if (!localData) {
        console.log('❌ localStorage에 데이터 없음');
        return;
      }

      const localTopics = JSON.parse(localData);
      if (!Array.isArray(localTopics) || localTopics.length === 0) return;

      // 이미 마이그레이션했는지 확인
      const migrationKey = `migrated_${user.id}`;
      console.log('🔑 마이그레이션 키:', migrationKey);
      console.log('✅ 이미 마이그레이션됨?', !!localStorage.getItem(migrationKey));
      if (localStorage.getItem(migrationKey)) {
        console.log('⏭️ 이미 마이그레이션 완료됨');
        return;
      }

      toast.info('기존 데이터를 마이그레이션 중입니다...');

      // 각 topic을 Supabase에 저장
      for (const localTopic of localTopics) {
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .insert({
            user_id: user.id,
            title: localTopic.topic,
            topic_type: localTopic.subject || 'research',
            status: localTopic.status || 'Todo',
            priority: localTopic.priority || 'Medium',
            is_locked: localTopic.isLocked || false,
            created_at: localTopic.createdAt || new Date().toISOString()
          })
          .select()
          .single();

        if (topicError) {
          console.error('Failed to migrate topic:', topicError);
          continue;
        }

        // research methods 저장
        if (localTopic.researchMethods?.length > 0 && topicData) {
          const methods = localTopic.researchMethods.map((method: string, index: number) => ({
            topic_id: topicData.id,
            content: method,
            index: index
          }));

          const { error: methodError } = await supabase
            .from('research_methods')
            .insert(methods);

          if (methodError) {
            console.error('Failed to migrate research methods:', methodError);
          }
        }
      }

      // 마이그레이션 완료 표시
      localStorage.setItem(migrationKey, 'true');
      localStorage.removeItem(STORAGE_KEY);
      toast.success('기존 데이터 마이그레이션이 완료되었습니다!');

      // 데이터 다시 로드
      await loadTopics();
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error('데이터 마이그레이션 중 오류가 발생했습니다.');
    }
  };

  // 사용자 변경 시 topics 다시 로드
  useEffect(() => {
    loadTopics();
  }, [user]);

  // 디버깅을 위한 localStorage 클리어 함수
  const clearLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    // 모든 마이그레이션 키도 삭제
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('migrated_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('🧹 localStorage 완전 클리어됨');
    toast.info('로컬 데이터가 클리어되었습니다. 페이지를 새로고침하세요.');
  };

  // 테스트용: 현재 사용자에게 테스트 데이터 추가
  const addTestData = async () => {
    if (!supabase || !user) {
      console.log('❌ supabase 또는 user 없음');
      return;
    }

    const testTopic = {
      user_id: user.id,
      title: `테스트 주제 - ${user.email} - ${Date.now()}`,
      topic_type: 'research',
      status: 'Todo',
      priority: 'High',
      is_locked: false
    };

    try {
      const { data, error } = await supabase
        .from('topics')
        .insert(testTopic)
        .select()
        .single();

      if (error) {
        console.error('❌ 테스트 데이터 삽입 실패:', error);
      } else {
        console.log('✅ 테스트 데이터 삽입 성공:', data);
        toast.success(`테스트 주제가 추가되었습니다: ${testTopic.title}`);
        // 데이터 다시 로드
        await loadTopics();
      }
    } catch (error) {
      console.error('❌ 테스트 데이터 삽입 중 오류:', error);
    }
  };

  // 개발용: 전역 함수로 노출
  if (typeof window !== 'undefined') {
    (window as any).clearArchiveLocalStorage = clearLocalStorage;
    (window as any).addTestData = addTestData;
  }

  // 새 topic 저장
  const saveTopic = async (topic: Omit<ArchivedTopic, 'id' | 'createdAt' | 'status' | 'priority'>) => {
    if (!supabase || !user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      console.log('💾 저장할 topic 데이터:', topic);
      console.log('👤 현재 사용자:', user.id);

      // topics 테이블에 저장
      const insertData = {
        user_id: user.id,
        title: topic.topic,
        topic_type: topic.subject || 'research',
        status: 'Todo',
        priority: 'Medium',
        is_locked: topic.isLocked || false,
        concept_id: null, // 명시적으로 null 설정
        sentence_id: null // 명시적으로 null 설정
      };

      console.log('📝 Supabase에 삽입할 데이터:', insertData);

      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .insert(insertData)
        .select()
        .single();

      console.log('🔍 topics 삽입 결과:', { topicData, topicError });

      if (topicError) throw topicError;

      // research methods 저장
      if (topic.researchMethods?.length > 0) {
        const methods = topic.researchMethods.map((method: string, index: number) => ({
          topic_id: topicData.id,
          content: method,
          index: index
        }));

        const { error: methodError } = await supabase
          .from('research_methods')
          .insert(methods);

        if (methodError) throw methodError;
      }

      // 로컬 상태 업데이트
      const newTopic: ArchivedTopic = {
        ...topic,
        id: topicData.id,
        createdAt: new Date(topicData.created_at),
        status: 'Todo',
        priority: 'Medium'
      };

      setArchivedTopics(prev => [newTopic, ...prev]);
      toast.success('주제가 아카이브에 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save topic:', error);
      toast.error('주제 저장에 실패했습니다.');
    }
  };

  // topic 상태 업데이트
  const updateTopicStatus = async (id: string, status: ArchivedTopic['status']) => {
    if (!supabase || !user) return;

    try {
      const { error } = await supabase
        .from('topics')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setArchivedTopics(prev =>
        prev.map(topic =>
          topic.id === id ? { ...topic, status } : topic
        )
      );
    } catch (error) {
      console.error('Failed to update topic status:', error);
      toast.error('상태 업데이트에 실패했습니다.');
    }
  };

  // topic 우선순위 업데이트
  const updateTopicPriority = async (id: string, priority: ArchivedTopic['priority']) => {
    if (!supabase || !user) return;

    try {
      const { error } = await supabase
        .from('topics')
        .update({ priority })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setArchivedTopics(prev =>
        prev.map(topic =>
          topic.id === id ? { ...topic, priority } : topic
        )
      );
    } catch (error) {
      console.error('Failed to update topic priority:', error);
      toast.error('우선순위 업데이트에 실패했습니다.');
    }
  };

  // topic 삭제
  const deleteTopic = async (id: string) => {
    if (!supabase || !user) return;

    try {
      // research_methods는 CASCADE로 자동 삭제됨
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setArchivedTopics(prev => prev.filter(topic => topic.id !== id));
      toast.success('주제가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete topic:', error);
      toast.error('주제 삭제에 실패했습니다.');
    }
  };

  return (
    <ArchiveContext.Provider
      value={{
        archivedTopics,
        saveTopic,
        updateTopicStatus,
        updateTopicPriority,
        deleteTopic,
        loading
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};