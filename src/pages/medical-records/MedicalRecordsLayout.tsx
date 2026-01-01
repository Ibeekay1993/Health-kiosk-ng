
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Stethoscope, ClipboardList, FileText, HeartPulse, TestTube2, ShieldCheck, User } from 'lucide-react';

const navLinks = [
    { to: "/medical-records", label: "Overview", icon: User },
    { to: "/medical-records/history", label: "Medical History", icon: HeartPulse },
    { to: "/medical-records/consultations", label: "Consultations", icon: Stethoscope },
    { to: "/medical-records/prescriptions", label: "Prescriptions", icon: ClipboardList },
    { to: "/medical-records/lab-results", label: "Lab Results", icon: TestTube2 },
    { to: "/medical-records/documents", label: "Documents", icon: FileText },
    { to: "/medical-records/insurance", label: "Insurance", icon: ShieldCheck },
];

const MedicalRecordsLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="col-span-1">
                    <h2 className="text-xl font-bold mb-4 px-4">Medical Records</h2>
                    <nav className="flex flex-col space-y-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                                        isActive && "bg-muted font-semibold text-primary"
                                    )}
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.label}
                                </NavLink>
                            );
                        })}
                    </nav>
                </aside>

                <main className="col-span-1 md:col-span-3">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MedicalRecordsLayout;
