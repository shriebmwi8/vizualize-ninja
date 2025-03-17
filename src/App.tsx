
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import DataExploration from "./pages/DataExploration";
import Visualizations from "./pages/Visualizations";
import RegressionAnalysis from "./pages/RegressionAnalysis";
import NotFound from "./pages/NotFound";
import ConnectionStatus from "./components/ConnectionStatus";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/exploration" element={<DataExploration />} />
          <Route path="/visualizations" element={<Visualizations />} />
          <Route path="/regression" element={<RegressionAnalysis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ConnectionStatus />
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
