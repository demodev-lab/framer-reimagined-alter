

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArchiveProvider } from "@/contexts/ArchiveContext";
import { CareerSentenceProvider } from "@/contexts/CareerSentenceContext";
import Index from "./pages/Index";
import TopicGenerator from "./pages/TopicGenerator";
import ProjectTopic from "./pages/ProjectTopic";
import Archive from "./pages/Archive";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import FaqChat from "./components/FaqChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CareerSentenceProvider>
      <ArchiveProvider>
        <TooltipProvider delayDuration={100}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/topic-generator" element={<TopicGenerator />} />
              <Route path="/project-topic" element={<ProjectTopic />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/feedback" element={<Feedback />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <FaqChat />
        </TooltipProvider>
      </ArchiveProvider>
    </CareerSentenceProvider>
  </QueryClientProvider>
);

export default App;
