import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import MedicalCareSheetPage from './pages/MedicalCareSheetPage';
import Records from "./pages/Records";
import Products from "./pages/Products";
import Billing from "./pages/Billing";
import SaasBilling from "./pages/SaasBilling";
import MultiTenantDashboard from "./pages/MultiTenantDashboard";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import Prescriptions from "./pages/Prescriptions";
import Teleconsult from "./pages/Teleconsult";
import Streaming from "./pages/Streaming";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "@/contexts/AuthContext";
import { ModalProvider } from "@/contexts/ModalContext";
import SocialPublish from "./pages/SocialPublish";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import Pricing from "./pages/Pricing";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import SubscriptionManagement from "./pages/SubscriptionManagement";

import { ProtectedRoute, PublicOnlyRoute } from "@/components/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="doctic-theme">
        <AuthProvider>
          <ModalProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PublicOnlyRoute redirectTo="/dashboard">
                        <LoginPage />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/medical-care-sheet" element={<MedicalCareSheetPage />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="/prescriptions" element={<Prescriptions />} />
                  <Route path="/teleconsult" element={<Teleconsult />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/saas-billing" element={<SaasBilling />} />
                  <Route path="/network" element={<MultiTenantDashboard />} />
                  <Route path="/assistant" element={<AIAssistant />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/publish-social" element={<SocialPublish />} />
                  <Route path="/streaming" element={<Streaming />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route
                    path="/subscription"
                    element={
                      <ProtectedRoute>
                        <SubscriptionManagement />
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
