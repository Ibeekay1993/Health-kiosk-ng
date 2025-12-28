
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop"; // Import the new component
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
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
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vitals from "./pages/Vitals";
import FindKiosk from "./pages/FindKiosk";
import Prescriptions from "./pages/Prescriptions";
import VendorSelection from "./pages/VendorSelection";
import NotFound from "./pages/NotFound";
import MobileDashboard from "./pages/MobileDashboard";
import Doctors from "./pages/Doctors";
import Chats from "./pages/Chats";
import MedicalRecords from "./pages/MedicalRecords";
import LaboratoryRequests from "./pages/LaboratoryRequests";
import Subscription from "./pages/Subscription";
import FamilyMembers from "./pages/FamilyMembers";
import CompleteProfile from "./pages/CompleteProfile";
import Profile from "./pages/Profile";
import DoctorDashboard from "./pages/DoctorDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import Contact from "./pages/Contact";
import Consultation from "./pages/Consultation";
import { AuthProvider } from "./hooks/use-auth";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes with Navbar */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/health-education" element={<HealthEducation />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Protected routes with DashboardLayout */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<MobileDashboard />} />
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
            
            {/* Other protected routes */}
            <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
            <Route path="/triage" element={<ProtectedRoute><Triage /></ProtectedRoute>} />
            <Route path="/vendor-selection" element={<ProtectedRoute><VendorSelection /></ProtectedRoute>} />
            <Route path="/insurance" element={<ProtectedRoute><Insurance /></ProtectedRoute>} />
            <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRoles={["doctor", "admin"]}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor-portal" element={<ProtectedRoute allowedRoles={["doctor", "admin"]}><DoctorPortal /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute allowedRoles={["doctor", "admin"]}><Patients /></ProtectedRoute>} />
            <Route path="/vendor-portal" element={<ProtectedRoute allowedRoles={["vendor", "admin"]}><VendorPortal /></ProtectedRoute>} />
            <Route path="/delivery-portal" element={<ProtectedRoute allowedRoles={["delivery_rider", "admin"]}><DeliveryPortal /></ProtectedRoute>} />
            <Route path="/kiosk-portal" element={<ProtectedRoute allowedRoles={["kiosk_partner", "admin"]}><KioskPortal /></ProtectedRoute>} />
            <Route path="/vitals" element={<ProtectedRoute allowedRoles={["kiosk_partner", "doctor", "admin"]}><Vitals /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
