import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

const Dashboard: FC = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // Redirect based on user role
  if (role === 'doctor') {
    return <Navigate to="/doctor-dashboard" replace />;
  } else {
    return <Navigate to="/patient-dashboard" replace />;
  }
};

export default Dashboard;