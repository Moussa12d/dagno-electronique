import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart";
import { Layout } from "./components/layout/Layout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { RequireAdmin } from "./components/RequireAdmin";
import { HomePage } from "./pages/HomePage";
import { TelephonesPage } from "./pages/TelephonesPage";
import { PhoneDetailPage } from "./pages/PhoneDetailPage";
import { AccessoiresPage } from "./pages/AccessoiresPage";
import { ReparationPage } from "./pages/ReparationPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AccountPage } from "./pages/AccountPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AdminDashboardPage } from "./pages/admin/DashboardPage";
import { AdminPhonesPage } from "./pages/admin/AdminPhonesPage";
import { AdminAccessoriesPage } from "./pages/admin/AdminAccessoriesPage";
import { AdminRepairsPage } from "./pages/admin/AdminRepairsPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Site public */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/telephones" element={<TelephonesPage />} />
                <Route path="/telephones/:id" element={<PhoneDetailPage />} />
                <Route path="/accessoires" element={<AccessoiresPage />} />
                <Route path="/reparation" element={<ReparationPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/connexion" element={<LoginPage />} />
                <Route path="/inscription" element={<RegisterPage />} />
                <Route path="/panier" element={<CartPage />} />
                <Route path="/commande" element={<CheckoutPage />} />
                <Route path="/mon-compte" element={<AccountPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Espace admin */}
              <Route element={<RequireAdmin />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route
                    path="/admin/telephones"
                    element={<AdminPhonesPage />}
                  />
                  <Route
                    path="/admin/accessoires"
                    element={<AdminAccessoriesPage />}
                  />
                  <Route
                    path="/admin/reparations"
                    element={<AdminRepairsPage />}
                  />
                  <Route
                    path="/admin/commandes"
                    element={<AdminOrdersPage />}
                  />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}