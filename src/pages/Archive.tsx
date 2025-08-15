import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArchive } from '@/contexts/ArchiveContext';
import Header from '@/components/Header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, ChevronDown, Filter, ArrowLeft, Eye, RefreshCw } from 'lucide-react';
import StructuredResearchMethod from '@/components/StructuredResearchMethod';
import ResearchMethodsCard from '@/components/ResearchMethodsCard';
import { n8nPollingClient } from '@/utils/n8nPollingClient';
import { toast } from '@/hooks/use-toast';
import { ArchivedTopic } from '@/types/archive';
const Archive = () => {
  const navigate = useNavigate();
  const {
    archivedTopics,
    updateTopicStatus,
    updateTopicPriority,
    deleteTopic
  } = useArchive();
  const [sortOrder, setSortOrder] = useState<string>('date');
  const [isRegeneratingMethods, setIsRegeneratingMethods] = useState<Record<string, boolean>>({});
  const [topicResearchMethods, setTopicResearchMethods] = useState<Record<string, string[]>>({});
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
  const handleGenerateResearchMethods = async (topicId: string, detailLevel?: string) => {
    setIsRegeneratingMethods(prev => ({
      ...prev,
      [topicId]: true
    }));
    
    const topic = archivedTopics.find(t => t.id === topicId);
    if (!topic) {
      setIsRegeneratingMethods(prev => ({
        ...prev,
        [topicId]: false
      }));
      return;
    }

    try {
      console.log('🔄 보관함에서 탐구 방법 생성 시작:', topic.title);
      
      // 실제 N8N API 호출
      const response = await n8nPollingClient.requestResearchMethods({
        topicName: topic.title,
        timestamp: new Date().toISOString(),
        source: "archive-page",
        detailLevel: detailLevel || "detailed"
      });

      if (response.success && response.data) {
        console.log('✅ N8N 탐구 방법 생성 성공:', response.data);
        
        // N8N 응답을 문자열 배열로 변환
        let methods: string[] = [];
        
        if (typeof response.data === 'string') {
          methods = [response.data];
        } else if (Array.isArray(response.data)) {
          methods = response.data.map(item => 
            typeof item === 'string' ? item : JSON.stringify(item)
          );
        } else {
          // 객체인 경우 JSON 문자열로 변환
          methods = [JSON.stringify(response.data)];
        }

        setTopicResearchMethods(prev => ({
          ...prev,
          [topicId]: methods
        }));
        
        toast({
          title: "탐구 방법 생성 완료",
          description: `${topic.title}에 대한 탐구 방법이 생성되었습니다.`,
        });
      } else {
        console.error('❌ N8N 탐구 방법 생성 실패:', response);
        toast({
          title: "탐구 방법 생성 실패",
          description: "다시 시도해주세요.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ 탐구 방법 생성 중 오류:', error);
      toast({
        title: "오류 발생",
        description: "탐구 방법 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingMethods(prev => ({
        ...prev,
        [topicId]: false
      }));
    }
  };
  const handleDifficultyUp = async (topicId: string) => {
    await handleGenerateResearchMethods(topicId, "very_detailed");
  };
  
  const handleDifficultyDown = async (topicId: string) => {
    await handleGenerateResearchMethods(topicId, "basic");
  };
  const handleMoreDetailed = async (topicId: string) => {
    await handleGenerateResearchMethods(topicId, "very_detailed");
  };
  const getTopicResearchMethods = (topicId: string) => {
    return topicResearchMethods[topicId] || [];
  };
  return <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleGoBack} className="h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">보관함</h1>
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

        {sortedTopics.length === 0 ? <div className="text-center py-12">
            <p className="text-muted-foreground">저장된 주제가 없습니다.</p>
          </div> : <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-center">No.</TableHead>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="w-[120px] text-center">과목</TableHead>
                  <TableHead className="w-[120px] text-center">주제 유형</TableHead>
                  <TableHead className="text-center">탐구 방법</TableHead>
                  <TableHead className="text-center">
              </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTopics.map((topic, index) => <TableRow key={topic.id}>
                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-medium">{topic.title}</div>
                        <div className="flex justify-center text-sm text-muted-foreground">
                          <span>교과 개념 : {topic.concept || '-'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {topic.subject ? <Badge variant="outline" className="text-xs">
                          {topic.subject}
                        </Badge> : <span className="text-xs text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`text-xs ${getTopicTypeColor(topic.topicType)}`}>
                        {topic.topicType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="h-8 p-2">
                            <Badge variant="default">
                              View
                            </Badge>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader className="text-center">
                            <DialogTitle>탐구 방법</DialogTitle>
                            <DialogDescription>
                              {topic.title}에 대한 탐구 방법입니다.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <ResearchMethodsCard
                            researchMethods={getTopicResearchMethods(topic.id)}
                            isLoading={isRegeneratingMethods[topic.id] || false}
                          />
                          
                          {getTopicResearchMethods(topic.id).length > 0 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDifficultyUp(topic.id)} 
                                disabled={isRegeneratingMethods[topic.id]}
                                className="flex items-center gap-1"
                              > 
                                난이도 ⬆️ 
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDifficultyDown(topic.id)} 
                                disabled={isRegeneratingMethods[topic.id]}
                                className="flex items-center gap-1"
                              >
                                난이도 ⬇️ 
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleGenerateResearchMethods(topic.id)} 
                                disabled={isRegeneratingMethods[topic.id]}
                                className="flex items-center gap-2"
                              >
                                {isRegeneratingMethods[topic.id] ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    재생성 중...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="h-4 w-4" />
                                    재생성
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                          
                          {getTopicResearchMethods(topic.id).length === 0 && !isRegeneratingMethods[topic.id] && (
                            <div className="text-center py-8 space-y-4">
                              <div className="text-muted-foreground">
                                아직 탐구 방법이 생성되지 않았습니다.
                              </div>
                              <div className="flex justify-center">
                                <Button 
                                  onClick={() => handleGenerateResearchMethods(topic.id)} 
                                  disabled={isRegeneratingMethods[topic.id]} 
                                  className="flex items-center gap-2"
                                >
                                  탐구 방법 생성하기
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => deleteTopic(topic.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>}
      </main>
    </div>;
};
export default Archive;