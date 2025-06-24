
export interface ArchivedTopic {
  id: string;
  title: string;
  subject: string;
  concept: string;
  topicType: string;
  researchMethods: string[];
  createdAt: Date;
  status: 'Todo' | 'In Progress' | 'Done' | 'Backlog' | 'Canceled';
  priority: 'Low' | 'Medium' | 'High' | 'None';
}
