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

// Admin Feature Imports
import { AdminDashboard } from "@/features/admin/components/Dashboard";
import { AdminUsersPage } from "@/features/admin/components/UsersPage";
import { AdminProductsPage } from "@/features/admin/components/ProductsPage";
import { AdminStoresPage } from "@/features/admin/components/StoresPage";
import { AdminWithdrawalsPage } from "@/features/admin/components/WithdrawalsPage";

// Keeper Feature Imports
import { KeeperRequestsPage } from "@/features/keeper/components/RequestsPage";
import { WarehouseStockPage } from "@/features/keeper/components/WarehouseStockPage";
import { FactoryInvoicesPage } from "@/features/keeper/components/FactoryInvoicesPage";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated, user } = useAuthStore();

  const getDefaultRoute = () => {
    if (!isAuthenticated || !user) return "/";
    switch (user.role) {
      case 'admin': return "/admin";
      case 'keeper': return "/keeper";
      case 'marketer': return "/dashboard";
      default: return "/";
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MarketerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="stores" element={<AdminStoresPage />} />
              <Route path="reports" element={<AdminWithdrawalsPage />} /> {/* Using Withdrawals as temporary reports */}
            </Route>

            {/* Keeper Routes */}
            <Route
              path="/keeper"
              element={
                <ProtectedRoute allowedRoles={['keeper']}>
                  <MarketerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<div className="p-8 text-center h-full flex flex-col items-center justify-center"><h1 className="text-2xl font-bold">لوحة أمين المخزن</h1><p className="text-muted-foreground">قم بإدارة المخزون وطلبات المسوقين من القائمة</p></div>} />
              <Route path="stock" element={<WarehouseStockPage />} />
              <Route path="requests" element={<KeeperRequestsPage />} />
              <Route path="factory-invoices" element={<FactoryInvoicesPage />} />
            </Route>

            {/* Marketer Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['marketer']}>
                  <MarketerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MarketerDashboard />} />
              <Route path="warehouse" element={<WarehousePage />} />
              <Route path="stores" element={<StoresPage />} />
              <Route path="stores/new-order" element={<NewOrderPage />} />
              <Route path="stores/returns" element={<ReturnsPage />} />
              <Route path="operations" element={<OperationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen">Unauthorized Access</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
