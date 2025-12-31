
import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Dashboard: FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!profile) {
    // This should ideally not be reached if ProtectedRoute is working correctly
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (profile.role === 'doctor') {
    return <Navigate to="/doctor-dashboard" replace />;
  } else {
    return <Navigate to="/patient-dashboard" replace />;
  }
};

export default Dashboard;
