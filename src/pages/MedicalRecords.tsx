
import { Routes, Route } from "react-router-dom";
import MedicalRecordsLayout from "@/pages/medical-records/MedicalRecordsLayout";
import Overview from "@/pages/medical-records/Overview";
import MedicalHistory from "@/pages/medical-records/MedicalHistory";
import Documents from "@/pages/medical-records/Documents";
import Insurance from "@/pages/medical-records/Insurance";
import Consultations from "@/pages/medical-records/Consultations";
import Prescriptions from "@/pages/medical-records/Prescriptions";
import LabResults from "@/pages/medical-records/LabResults";
import withAuth from "@/hoc/withAuth";

const MedicalRecords = () => {
  return (
    <MedicalRecordsLayout>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="history" element={<MedicalHistory />} />
        <Route path="documents" element={<Documents />} />
        <Route path="insurance" element={<Insurance />} />
        <Route path="consultations" element={<Consultations />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="lab-results" element={<LabResults />} />
      </Routes>
    </MedicalRecordsLayout>
  );
};

export default withAuth(MedicalRecords);
