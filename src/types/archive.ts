
export interface ArchivedTopic {
  id: string;
  topic: string;  // 주제 제목
  subject: string;  // 과목
  researchMethods: string[];  // 탐구 방법들
  createdAt: Date;
  status: 'Todo' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  isLocked?: boolean;  // 주제 잠금 여부
}
