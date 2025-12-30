
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from 'react';

const steps = [
  { id: '1', name: 'Professional Profile', href: '/doctor-onboarding/profile' },
  { id: '2', name: 'Document Submission', href: '/doctor-onboarding/documents' },
  { id: '3', name: 'Referee Submission', href: '/doctor-onboarding/referees' },
  { id: '4', name: 'Interview Preparation', href: '/doctor-onboarding/interview' },
  { id: '5', name: 'HR Review and Approval', href: '/doctor-onboarding/review' },
  { id: '6', name: 'Document Signing', href: '/doctor-onboarding/signing' },
];

const DoctorOnboarding = () => {
  const location = useLocation();
  const [doctorStatus, setDoctorStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: doctor, error } = await supabase
          .from('doctors')
          .select('status')
          .eq('user_id', user.id)
          .single();
        
        if (doctor) {
          setDoctorStatus(doctor.status);
        }
      }
      setLoading(false);
    };

    fetchDoctorStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loader
  }

  if (doctorStatus === 'approved') {
    return <Navigate to="/doctor/dashboard" />
  }

  const getStepStatus = (stepHref: string) => {
    const stepIndex = steps.findIndex(s => s.href === stepHref);
    const statusIndex = steps.findIndex(s => `/doctor-onboarding/${doctorStatus?.replace('pending_', '')}`.startsWith(s.href));

    if (stepIndex < statusIndex) return 'Completed';
    if (stepIndex === statusIndex) return 'In Progress';
    return 'Pending';
  }

  const currentStepIndex = steps.findIndex(step => location.pathname.startsWith(step.href));

  return (
    <div className="flex min-h-screen bg-muted/40">
      <div className="w-1/4 bg-white p-8 border-r">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Your Progress</h2>
          <p className="text-muted-foreground">Check your progress and review the things.</p>
        </div>
        <nav>
          <ul className="space-y-4">
            {steps.map((step, index) => {
              const status = getStepStatus(step.href);
              return (
                <li key={step.id}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${status === 'Completed' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                      {step.id}
                    </div>
                    <div>
                      <p className={`font-semibold ${status !== 'Pending' ? 'text-primary' : 'text-gray-500'}`}>{step.name}</p>
                      <p className={`text-sm ${status === 'In Progress' ? 'text-blue-500' : 'text-muted-foreground'}`}>
                        {status}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })          }
          </ul>
        </nav>
      </div>
      <div className="w-3/4 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorOnboarding;
