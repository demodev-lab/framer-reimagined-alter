
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TopicGenerator from "./pages/TopicGenerator";
import Feedback from "./pages/Feedback";
import RecordAnalysis from "./pages/RecordAnalysis";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import FaqChat from "./components/FaqChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={100}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/topic-generator" element={<TopicGenerator />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/record-analysis" element={<RecordAnalysis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <FaqChat />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
