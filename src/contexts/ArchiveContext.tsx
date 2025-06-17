
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ArchivedTopic } from '@/types/archive';
import { toast } from 'sonner';

interface ArchiveContextType {
  archivedTopics: ArchivedTopic[];
  saveTopic: (topic: Omit<ArchivedTopic, 'id' | 'createdAt' | 'status' | 'priority'>) => void;
  updateTopicStatus: (id: string, status: ArchivedTopic['status']) => void;
  updateTopicPriority: (id: string, priority: ArchivedTopic['priority']) => void;
  deleteTopic: (id: string) => void;
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

export const ArchiveProvider: React.FC<ArchiveProviderProps> = ({ children }) => {
  const [archivedTopics, setArchivedTopics] = useState<ArchivedTopic[]>([]);

  const saveTopic = (topic: Omit<ArchivedTopic, 'id' | 'createdAt' | 'status' | 'priority'>) => {
    const newTopic: ArchivedTopic = {
      ...topic,
      id: `TASK-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date(),
      status: 'Todo',
      priority: 'Medium'
    };

    setArchivedTopics(prev => [newTopic, ...prev]);
    toast.success('주제가 아카이브에 저장되었습니다.');
  };

  const updateTopicStatus = (id: string, status: ArchivedTopic['status']) => {
    setArchivedTopics(prev =>
      prev.map(topic =>
        topic.id === id ? { ...topic, status } : topic
      )
    );
  };

  const updateTopicPriority = (id: string, priority: ArchivedTopic['priority']) => {
    setArchivedTopics(prev =>
      prev.map(topic =>
        topic.id === id ? { ...topic, priority } : topic
      )
    );
  };

  const deleteTopic = (id: string) => {
    setArchivedTopics(prev => prev.filter(topic => topic.id !== id));
    toast.success('주제가 삭제되었습니다.');
  };

  return (
    <ArchiveContext.Provider
      value={{
        archivedTopics,
        saveTopic,
        updateTopicStatus,
        updateTopicPriority,
        deleteTopic
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};
