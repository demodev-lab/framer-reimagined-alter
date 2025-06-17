import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArchive } from '@/contexts/ArchiveContext';
import Header from '@/components/Header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, ChevronDown, Filter, ArrowLeft, Eye, RefreshCw } from 'lucide-react';
import { ArchivedTopic } from '@/types/archive';

const Archive = () => {
  const navigate = useNavigate();
  const { archivedTopics, updateTopicStatus, updateTopicPriority, deleteTopic, updateTopicResearchMethods } = useArchive();
  const [sortOrder, setSortOrder] = useState<string>('date');
  const [isRegeneratingMethods, setIsRegeneratingMethods] = useState<Record<string, boolean>>({});

  const sortedTopics = [...archivedTopics].sort((a, b) => {
    if (sortOrder === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'alphabetical') {
      return a.title.localeCompare(b.title, 'ko');
    }
    return 0;
  });

  const handleGoBack = () => {
    navigate('/topic-generator');
  };

  const getPriorityBadgeVariant = (priority: ArchivedTopic['priority']) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      case 'Low':
        return 'secondary';
      case 'None':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTopicTypeColor = (topicType: string) => {
    switch (topicType) {
      case '보고서 주제':
        return 'bg-blue-100 text-blue-800';
      case '실험 주제':
        return 'bg-green-100 text-green-800';
      case '제작 주제':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateResearchMethods = (topic: ArchivedTopic) => {
    return [
      `'${topic.title}'의 선행 연구 분석: 기존 연구의 한계점을 명확히 하고, 본 연구의 독창적 기여 지점을 구체화하는 방법론.`,
      `심층 인터뷰 및 설문조사 병행: 정량적 데이터와 정성적 데이터를 통합 분석하여, '${topic.title}'에 대한 다각적 이해를 도모하는 혼합 연구 설계.`,
      `파일럿 테스트 기반 실험 설계: 소규모 예비 실험을 통해 변수를 통제하고, 본 실험의 신뢰도와 타당도를 극대화하는 전략.`,
      `연구 윤리 고려사항: 연구 참여자의 권익 보호 및 데이터 보안을 위한 구체적인 프로토콜 제시.`
    ];
  };

  const handleRegenerateResearchMethods = async (topicId: string) => {
    setIsRegeneratingMethods(prev => ({ ...prev, [topicId]: true }));
    
    const topic = archivedTopics.find(t => t.id === topicId);
    if (!topic) return;

    // Simulate API call delay
    setTimeout(() => {
      const newMethods = generateResearchMethods(topic);
      updateTopicResearchMethods(topicId, newMethods);
      setIsRegeneratingMethods(prev => ({ ...prev, [topicId]: false }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleGoBack}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">아카이브</h1>
              <p className="text-muted-foreground">저장된 탐구 주제들을 관리하세요</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                정렬
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                <DropdownMenuRadioItem value="date">날짜순</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="alphabetical">가나다순</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {sortedTopics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">저장된 주제가 없습니다.</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No.</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>탐구 방법</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTopics.map((topic, index) => (
                  <TableRow key={topic.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{topic.title}</div>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          {topic.subject && <span>{topic.subject}</span>}
                          {topic.concept && <span>• {topic.concept}</span>}
                        </div>
                        <Badge className={`text-xs ${getTopicTypeColor(topic.topicType)}`}>
                          {topic.topicType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>탐구 방법</DialogTitle>
                            <DialogDescription>
                              {topic.title}에 대한 탐구 방법입니다.
                            </DialogDescription>
                          </DialogHeader>
                          
                          {topic.researchMethods && topic.researchMethods.length > 0 ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {topic.researchMethods.length}개의 탐구 방법
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRegenerateResearchMethods(topic.id)}
                                  disabled={isRegeneratingMethods[topic.id]}
                                  className="flex items-center gap-2"
                                >
                                  <RefreshCw className={`h-4 w-4 ${isRegeneratingMethods[topic.id] ? 'animate-spin' : ''}`} />
                                  다시 생성
                                </Button>
                              </div>
                              <div className="space-y-3">
                                {topic.researchMethods.map((method, methodIndex) => (
                                  <div key={methodIndex} className="p-3 bg-muted rounded-lg">
                                    <div className="text-sm font-medium mb-1">방법 {methodIndex + 1}</div>
                                    <div className="text-sm text-muted-foreground">{method}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 space-y-4">
                              <div className="text-muted-foreground">
                                아직 탐구 방법이 생성되지 않았습니다.
                              </div>
                              <Button
                                onClick={() => handleRegenerateResearchMethods(topic.id)}
                                disabled={isRegeneratingMethods[topic.id]}
                                className="flex items-center gap-2"
                              >
                                <RefreshCw className={`h-4 w-4 ${isRegeneratingMethods[topic.id] ? 'animate-spin' : ''}`} />
                                {isRegeneratingMethods[topic.id] ? '생성 중...' : '탐구 방법 생성'}
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 p-2">
                            <Badge variant={getPriorityBadgeVariant(topic.priority)}>
                              {topic.priority}
                            </Badge>
                            <ChevronDown className="ml-1 h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuRadioGroup
                            value={topic.priority}
                            onValueChange={(value) => updateTopicPriority(topic.id, value as ArchivedTopic['priority'])}
                          >
                            <DropdownMenuRadioItem value="High">High</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Medium">Medium</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Low">Low</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="None">None</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteTopic(topic.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Archive;
