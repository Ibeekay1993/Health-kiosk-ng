import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Triage from "./pages/Triage";
import Chat from "./pages/Chat";
import Video from "./pages/Video";
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
import Records from "./pages/Records";
import Vitals from "./pages/Vitals";
import FindKiosk from "./pages/FindKiosk";
import Prescriptions from "./pages/Prescriptions";
import VendorSelection from "./pages/VendorSelection";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Chats from "./pages/Chats";
import MedicalRecords from "./pages/MedicalRecords";
import LaboratoryRequests from "./pages/LaboratoryRequests";
import Subscription from "./pages/Subscription";
import FamilyMembers from "./pages/FamilyMembers";
import CompleteProfile from "./pages/CompleteProfile";
import BookAppointment from "./pages/BookAppointment";
import SupabaseData from "./pages/SupabaseData"; // Import the new component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/health-education" element={<HealthEducation />} />
          <Route path="/find-kiosk" element={<FindKiosk />} />

          {/* Protected routes */}
          <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/book-appointment" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
          <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
          <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
          <Route path="/laboratory-requests" element={<ProtectedRoute><LaboratoryRequests /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/family-members" element={<ProtectedRoute><FamilyMembers /></ProtectedRoute>} />
          <Route path="/supabase-data" element={<ProtectedRoute><SupabaseData /></ProtectedRoute>} /> {/* Add the new route */}
          <Route path="/triage" element={
            <ProtectedRoute>
              <Triage />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/video" element={
            <ProtectedRoute>
              <Video />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="/records" element={
            <ProtectedRoute>
              <Records />
            </ProtectedRoute>
          } />
          <Route path="/prescriptions" element={
            <ProtectedRoute>
              <Prescriptions />
            </ProtectedRoute>
          } />
          <Route path="/vendor-selection" element={
            <ProtectedRoute>
              <VendorSelection />
            </ProtectedRoute>
          } />
          <Route path="/insurance" element={
            <ProtectedRoute>
              <Insurance />
            </ProtectedRoute>
          } />

          {/* Doctor routes */}
          <Route path="/doctor-portal" element={
            <ProtectedRoute allowedRoles={["doctor", "admin"]}>
              <DoctorPortal />
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute allowedRoles={["doctor", "admin"]}>
              <Patients />
            </ProtectedRoute>
          } />

          {/* Vendor routes */}
          <Route path="/vendor-portal" element={
            <ProtectedRoute allowedRoles={["vendor", "admin"]}>
              <VendorPortal />
            </ProtectedRoute>
          } />

          {/* Delivery routes */}
          <Route path="/delivery-portal" element={
            <ProtectedRoute allowedRoles={["delivery_rider", "admin"]}>
              <DeliveryPortal />
            </ProtectedRoute>
          } />

          {/* Kiosk routes */}
          <Route path="/kiosk-portal" element={
            <ProtectedRoute allowedRoles={["kiosk_partner", "admin"]}>
              <KioskPortal />
            </ProtectedRoute>
          } />
          <Route path="/vitals" element={
            <ProtectedRoute allowedRoles={["kiosk_partner", "doctor", "admin"]}>
              <Vitals />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
