import React, { useState } from 'react';
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
import { Trash2, ChevronDown, Filter } from 'lucide-react';
import { ArchivedTopic } from '@/types/archive';

const Archive = () => {
  const { archivedTopics, updateTopicStatus, updateTopicPriority, deleteTopic } = useArchive();
  const [sortOrder, setSortOrder] = useState<string>('date');

  const sortedTopics = [...archivedTopics].sort((a, b) => {
    if (sortOrder === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'alphabetical') {
      return a.title.localeCompare(b.title, 'ko');
    }
    return 0;
  });

  const getStatusBadgeVariant = (status: ArchivedTopic['status']) => {
    switch (status) {
      case 'Done':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Todo':
        return 'outline';
      case 'Backlog':
        return 'secondary';
      case 'Canceled':
        return 'destructive';
      default:
        return 'outline';
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">아카이브</h1>
            <p className="text-muted-foreground">저장된 탐구 주제들을 관리하세요</p>
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
                  <TableHead className="w-[100px]">Task</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTopics.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell className="font-medium">{topic.id}</TableCell>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 p-2">
                            <Badge variant={getStatusBadgeVariant(topic.status)}>
                              {topic.status}
                            </Badge>
                            <ChevronDown className="ml-1 h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuRadioGroup
                            value={topic.status}
                            onValueChange={(value) => updateTopicStatus(topic.id, value as ArchivedTopic['status'])}
                          >
                            <DropdownMenuRadioItem value="Todo">Todo</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="In Progress">In Progress</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Done">Done</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Backlog">Backlog</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Canceled">Canceled</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
