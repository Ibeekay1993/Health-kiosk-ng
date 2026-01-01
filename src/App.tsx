
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Triage from "./pages/Triage";
import Chat from "./pages/Chat";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import DoctorPortal from "./pages/DoctorPortal";
import VendorPortal from "./pages/VendorPortal";
import DeliveryPortal from "./pages/DeliveryPortal";
import KioskPortal from "./pages/KioskPortal";
import HealthEducation from "./pages/HealthEducation";
import Insurance from "./pages/Insurance";
import Vitals from "./pages/Vitals";
import FindKiosk from "./pages/FindKiosk";
import Prescriptions from "./pages/Prescriptions";
import VendorSelection from "./pages/VendorSelection";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Doctors from "./pages/Doctors";
import Chats from "./pages/Chats";
import MedicalRecords from "./pages/MedicalRecords";
import LaboratoryRequests from "./pages/LaboratoryRequests";
import Subscription from "./pages/Subscription";
import FamilyMembers from "./pages/FamilyMembers";
import Profile from "./pages/Profile";
import DoctorDashboard from "./pages/DoctorDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import Contact from "./pages/Contact";
import Consultation from "./pages/Consultation";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import OnboardingPage from "./pages/OnboardingPage";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/health-education" element={<HealthEducation />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patient-dashboard" element={<PatientDashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/chat" element={<Chats />} />
                <Route path="/chat/:id" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/prescriptions" element={<Prescriptions />} />
                <Route path="/medical-records/*" element={<MedicalRecords />} />
                <Route path="/laboratory-requests" element={<LaboratoryRequests />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/family-members" element={<FamilyMembers />} />
                <Route path="/find-kiosk" element={<FindKiosk />} />
                <Route path="/consultation" element={<Consultation />} />
              </Route>
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>

            {/* Other routes */}
            <Route path="/triage" element={<Triage />} />
            <Route path="/vendor-selection" element={<VendorSelection />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-portal" element={<DoctorPortal />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/vendor-portal" element={<VendorPortal />} />
            <Route path="/delivery-portal" element={<DeliveryPortal />} />
            <Route path="/kiosk-portal" element={<KioskPortal />} />
            <Route path="/vitals" element={<Vitals />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;
