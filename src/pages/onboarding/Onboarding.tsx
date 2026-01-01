
import useAuth from "@/hooks/useAuth";
import DoctorOnboarding from "./DoctorOnboarding";
import AdminOnboarding from "./AdminOnboarding";
import PatientOnboarding from "./PatientOnboarding";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarLoader } from "react-spinners";

const Onboarding = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <BarLoader color="#36d7b7" />
            </div>
        );
    }

    const role = user.user_metadata?.role;

    const renderOnboardingFlow = () => {
        switch (role) {
            case 'doctor':
                return <DoctorOnboarding />;
            case 'admin':
                return <AdminOnboarding />;
            case 'patient':
                return <PatientOnboarding />;
            default:
                return <p>Invalid user role. Please contact support.</p>;
        }
    };

    if (role === 'patient') {
        return <PatientOnboarding />;
    }

    const getTitleAndDescription = () => {
        switch (role) {
            case 'doctor':
                return {
                    title: "Doctor Onboarding",
                    description: "Complete your profile to join our network of top-tier medical professionals."
                };
            case 'admin':
                return {
                    title: "Admin Onboarding",
                    description: "Set up your organization's profile and start managing your team."
                };
            default:
                return { title: "", description: "" };
        }
    };

    const { title, description } = getTitleAndDescription();

    return (
        <div className="container mx-auto p-4 md:p-8 flex flex-col items-center">
            <Card className="w-full max-w-4xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground pt-2">{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {renderOnboardingFlow()}
                </CardContent>
            </Card>
        </div>
    );
};

export default Onboarding;
