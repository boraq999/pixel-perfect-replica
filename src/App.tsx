import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { AppLayout } from "@/components/layout/AppLayout";
import { MarketerDashboard } from "@/features/marketer/components/Dashboard";
import { WarehousePage } from "@/features/marketer/components/WarehousePage";
import { StoresPage } from "@/features/marketer/components/StoresPage";
import { StoreDetailsPage } from "@/features/marketer/components/StoreDetailsPage";
import { NewOrderPage } from "@/features/marketer/components/NewOrderPage";
import { ReturnsPage } from "@/features/marketer/components/ReturnsPage";
import { OperationsPage } from "@/features/marketer/components/OperationsPage";
import { SettingsPage } from "@/features/marketer/components/SettingsPage";
import { BestMarketerDashboard } from "@/features/marketer/components/BestMarketerDashboard";
import { OrderManagementPage } from "@/features/marketer/components/OrderManagementPage";
import { ProfitsWithdrawalPage } from "@/features/marketer/components/ProfitsWithdrawalPage";
import { NewStockRequestPage } from "@/features/marketer/components/NewStockRequestPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import NotFound from "./pages/NotFound";

// Admin Feature Imports
import { AdminDashboard } from "@/features/admin/components/Dashboard";
import { AdminUsersPage } from "@/features/admin/components/UsersPage";
import { AdminProductsPage } from "@/features/admin/components/ProductsPage";
import { AdminStoresPage } from "@/features/admin/components/StoresPage";
import { AdminWithdrawalsPage } from "@/features/admin/components/WithdrawalsPage";
import { AdminSettingsPage } from "@/features/admin/components/SettingsPage";

// Keeper Feature Imports
import { KeeperRequestsPage } from "@/features/keeper/components/RequestsPage";
import { WarehouseStockPage } from "@/features/keeper/components/WarehouseStockPage";
import { FactoryInvoicesPage } from "@/features/keeper/components/FactoryInvoicesPage";
import { KeeperDeliveryConfirmationPage } from "@/features/keeper/components/DeliveryConfirmationPage";
import { KeeperPaymentConfirmationPage } from "@/features/keeper/components/PaymentConfirmationPage";
import { KeeperSalesReturnsPage } from "@/features/keeper/components/SalesReturnsPage";
import { KeeperSalesDocsPage } from "@/features/keeper/components/SalesDocsPage";
import { KeeperSettingsPage } from "@/features/keeper/components/SettingsPage";
import { WarehouseRequestsPage } from "@/features/keeper/components/WarehouseRequestsPage";


import { ThemeProvider } from "@/components/theme-provider";

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
    <ThemeProvider attribute="class" defaultTheme="aurora" themes={["aurora", "ocean", "sunset", "forest", "rose", "sunshine", "cloud", "pearl", "mint", "meadow"]} enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" richColors />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="stores" element={<AdminStoresPage />} />
                <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
                <Route path="reports" element={<div>System Reports</div>} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Keeper Routes */}
              <Route
                path="/keeper"
                element={
                  <ProtectedRoute allowedRoles={['keeper']}>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<div className="p-8 text-center h-full flex flex-col items-center justify-center"><h1 className="text-2xl font-bold">لوحة أمين المخزن</h1><p className="text-muted-foreground">قم بإدارة المخزون وطلبات المسوقين من القائمة</p></div>} />
                <Route path="stock" element={<WarehouseStockPage />} />
                <Route path="requests" element={<KeeperRequestsPage />} />
                <Route path="marketer-requests" element={<WarehouseRequestsPage />} />
                <Route path="factory-invoices" element={<FactoryInvoicesPage />} />
                <Route path="delivery-confirmation" element={<KeeperDeliveryConfirmationPage />} />
                <Route path="payment-confirmation" element={<KeeperPaymentConfirmationPage />} />
                <Route path="sales-returns" element={<KeeperSalesReturnsPage />} />
                <Route path="sales-docs" element={<KeeperSalesDocsPage />} />
                <Route path="settings" element={<KeeperSettingsPage />} />
              </Route>

              {/* Marketer Routes - Using Best Marketer Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['marketer']}>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<BestMarketerDashboard />} />
                <Route path="orders" element={<OrderManagementPage />} />
                <Route path="warehouse" element={<WarehousePage />} />
                <Route path="warehouse/receive" element={<NewStockRequestPage />} />
                <Route path="stores" element={<StoresPage />} />
                <Route path="stores/:storeId" element={<StoreDetailsPage />} />
                <Route path="stores/new-order" element={<NewOrderPage />} />
                <Route path="returns" element={<ReturnsPage />} />
                <Route path="profits" element={<ProfitsWithdrawalPage />} />
                <Route path="operations" element={<OperationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen">Unauthorized Access</div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
