import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LivePulseProvider } from "./contexts/LivePulseContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LivePulseLayout from "./layouts/LivePulseLayout";
import Dashboard from "./pages/livepulse/Dashboard";
import Signals from "./pages/livepulse/Signals";
import Insights from "./pages/livepulse/Insights";
import Actions from "./pages/livepulse/Actions";
import Collective from "./pages/livepulse/Collective";
import Culture from "./pages/livepulse/Culture";
import Settings from "./pages/livepulse/Settings";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LivePulseProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* LivePulse Dashboard Routes */}
              <Route path="/livepulse" element={<LivePulseLayout><Dashboard /></LivePulseLayout>} />
              <Route path="/livepulse/signals" element={<LivePulseLayout><Signals /></LivePulseLayout>} />
              <Route path="/livepulse/insights" element={<LivePulseLayout><Insights /></LivePulseLayout>} />
              <Route path="/livepulse/actions" element={<LivePulseLayout><Actions /></LivePulseLayout>} />
              <Route path="/livepulse/collective" element={<LivePulseLayout><Collective /></LivePulseLayout>} />
              <Route path="/livepulse/culture" element={<LivePulseLayout><Culture /></LivePulseLayout>} />
              <Route path="/livepulse/settings" element={<LivePulseLayout><Settings /></LivePulseLayout>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LivePulseProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
