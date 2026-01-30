import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { MarketerLayout } from "@/features/marketer/components/MarketerLayout";
import { MarketerDashboard } from "@/features/marketer/components/Dashboard";
import { PlaceholderPage } from "@/features/marketer/components/PlaceholderPage";
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
              <Route
                path="warehouse"
                element={<PlaceholderPage title="إدارة المخزن" description="استلام وإرجاع البضائع من وإلى المخزن" />}
              />
              <Route
                path="stores"
                element={<PlaceholderPage title="إدارة المتاجر" description="إنشاء الطلبات وإصدار الفواتير" />}
              />
              <Route
                path="operations"
                element={<PlaceholderPage title="العمليات" description="تقارير العمليات والإحصائيات" />}
              />
              <Route
                path="settings"
                element={<PlaceholderPage title="الإعدادات" description="إعدادات الحساب والتطبيق" />}
              />
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
