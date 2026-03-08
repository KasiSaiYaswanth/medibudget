import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MedicineScanner from "./pages/MedicineScanner";
import CostEstimation from "./pages/CostEstimation";
import SchemeChecker from "./pages/SchemeChecker";
import EstimationHistory from "./pages/EstimationHistory";
import SymptomChecker from "./pages/SymptomChecker";
import InsuranceCalculator from "./pages/InsuranceCalculator";
import HealthDashboard from "./pages/HealthDashboard";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSymptoms from "./pages/admin/AdminSymptoms";
import AdminCosts from "./pages/admin/AdminCosts";
import AdminHospitals from "./pages/admin/AdminHospitals";
import AdminMedicines from "./pages/admin/AdminMedicines";
import AdminSchemes from "./pages/admin/AdminSchemes";
import AdminInsurance from "./pages/admin/AdminInsurance";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAudit from "./pages/admin/AdminAudit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scanner" element={<MedicineScanner />} />
          <Route path="/estimate" element={<CostEstimation />} />
          <Route path="/schemes" element={<SchemeChecker />} />
          <Route path="/history" element={<EstimationHistory />} />
          <Route path="/symptoms" element={<SymptomChecker />} />
          <Route path="/insurance" element={<InsuranceCalculator />} />
          <Route path="/health" element={<HealthDashboard />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/symptoms" element={<AdminLayout><AdminSymptoms /></AdminLayout>} />
          <Route path="/admin/costs" element={<AdminLayout><AdminCosts /></AdminLayout>} />
          <Route path="/admin/hospitals" element={<AdminLayout><AdminHospitals /></AdminLayout>} />
          <Route path="/admin/medicines" element={<AdminLayout><AdminMedicines /></AdminLayout>} />
          <Route path="/admin/schemes" element={<AdminLayout><AdminSchemes /></AdminLayout>} />
          <Route path="/admin/insurance" element={<AdminLayout><AdminInsurance /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/audit" element={<AdminLayout><AdminAudit /></AdminLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
