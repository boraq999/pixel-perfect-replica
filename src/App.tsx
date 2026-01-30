import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { MarketerLayout } from "@/features/marketer/components/MarketerLayout";
import { MarketerDashboard } from "@/features/marketer/components/Dashboard";
import { WarehousePage } from "@/features/marketer/components/WarehousePage";
import { StoresPage } from "@/features/marketer/components/StoresPage";
import { NewOrderPage } from "@/features/marketer/components/NewOrderPage";
import { ReturnsPage } from "@/features/marketer/components/ReturnsPage";
import { OperationsPage } from "@/features/marketer/components/OperationsPage";
import { SettingsPage } from "@/features/marketer/components/SettingsPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            {/* Login Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
              }
            />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MarketerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MarketerDashboard />} />
              <Route path="warehouse" element={<WarehousePage />} />
              <Route path="warehouse/receive" element={<WarehousePage />} />
              <Route path="stores" element={<StoresPage />} />
              <Route path="stores/new-order" element={<NewOrderPage />} />
              <Route path="stores/returns" element={<ReturnsPage />} />
              <Route path="operations" element={<OperationsPage />} />
              <Route path="reports" element={<OperationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
