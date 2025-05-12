
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import WorkstreamsPage from "./pages/WorkstreamsPage";
import MilestonesPage from "./pages/MilestonesPage";
import RisksIssuesPage from "./pages/RisksIssuesPage";
import DependenciesPage from "./pages/DependenciesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workstreams" element={<WorkstreamsPage />} />
          <Route path="/milestones" element={<MilestonesPage />} />
          <Route path="/risks-issues" element={<RisksIssuesPage />} />
          <Route path="/dependencies" element={<DependenciesPage />} />
          <Route path="/chat" element={<ChatPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
