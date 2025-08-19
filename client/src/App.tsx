import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { LanguageProvider } from "./components/language-provider";
import { AuthProvider } from "./contexts/auth-context";
import Home from "./pages/home";
import Videos from "./pages/videos";
import Translations from "./pages/translations";
import TranslationCheckout from "./pages/translation-checkout";
import TranslationSuccess from "./pages/translation-success";
import FormPurchaseSuccess from "./pages/form-purchase-success";
import Resources from "./pages/resources";
import TestimonialsRead from "./pages/testimonials-read";
import TestimonialsSubmit from "./pages/testimonials";
import FreeForms from "./pages/free-forms";
import Forms from "./pages/forms";
import Checkout from "./pages/checkout";
import SimpleCheckout from "./pages/simple-checkout";
import { AdminLogin } from "./pages/admin/login";
import { AdminLayout } from "./pages/admin/layout";
import { ProtectedRoute } from "./components/protected-route";
import { AdminDashboard } from "./pages/admin/dashboard";
import { AdminContacts } from "./pages/admin/contacts";
import { AdminOrders } from "./pages/admin/orders";
import { AdminPayments } from "./pages/admin/payments";
import { AdminProducts } from "./pages/admin/products";
import { AdminUsers } from "./pages/admin/users";
import { AdminSettings } from "./pages/admin/settings";
import { AdminTranslationPricing } from "./pages/admin/translation-pricing";
import Glossary from "./pages/resources/glossary";
import FilingOrder from "./pages/resources/filing-order";
import CommonMistakes from "./pages/resources/common-mistakes";
import Fees from "./pages/resources/fees";
import FAQ from "./pages/resources/faq";
import NotFound from "./pages/not-found";
import { queryClient } from "./lib/queryClient";
import ScrollToTop from "./components/scroll-to-top";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ScrollToTop />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/videos" component={Videos} />
            <Route path="/translations" component={Translations} />
            <Route path="/translation-checkout" component={TranslationCheckout} />
            <Route path="/translation-success" component={TranslationSuccess} />
            <Route path="/form-purchase-success" component={FormPurchaseSuccess} />
            <Route path="/resources" component={Resources} />
            <Route path="/testimonials" component={TestimonialsRead} />
            <Route path="/testimonials/submit" component={TestimonialsSubmit} />
            <Route path="/free-forms" component={FreeForms} />
            <Route path="/forms" component={Forms} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/simple-checkout" component={SimpleCheckout} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin" component={() => <ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/dashboard" component={() => <ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/contacts" component={() => <ProtectedRoute><AdminLayout><AdminContacts /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/orders" component={() => <ProtectedRoute><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/payments" component={() => <ProtectedRoute><AdminLayout><AdminPayments /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/translation-pricing" component={() => <ProtectedRoute><AdminLayout><AdminTranslationPricing /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/products" component={() => <ProtectedRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/users" component={() => <ProtectedRoute><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/settings" component={() => <ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
            <Route path="/resources/glossary" component={Glossary} />
            <Route path="/resources/filing-order" component={FilingOrder} />
            <Route path="/resources/common-mistakes" component={CommonMistakes} />
            <Route path="/resources/fees" component={Fees} />
            <Route path="/resources/faq" component={FAQ} />
            <Route path="*" component={NotFound} />
          </Switch>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;