
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Cake, VenetianMask, Stethoscope, FileText, Beaker, History as HistoryIcon } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) => (
    <div className="flex items-center gap-4 py-2">
        <div className="p-2 bg-muted rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value || 'Not available'}</p>
        </div>
    </div>
);

const ActivityItem = ({ icon, title, description, date }: { icon: React.ReactNode, title: string, description: string, date: string }) => (
    <div className="flex items-start gap-4 py-3 border-b last:border-b-0">
        <div className="p-2 bg-muted/50 rounded-full">
            {icon}
        </div>
        <div className="flex-grow">
            <p className="font-medium text-sm">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <p className="text-xs text-muted-foreground whitespace-nowrap pt-1">{formatDistanceToNow(new Date(date), { addSuffix: true })}</p>
    </div>
);

const activityIcons: { [key: string]: React.ReactNode } = {
    consultation: <Stethoscope className="h-5 w-5 text-blue-500" />,
    prescription: <FileText className="h-5 w-5 text-green-500" />,
    lab_result: <Beaker className="h-5 w-5 text-purple-500" />,
    history: <HistoryIcon className="h-5 w-5 text-orange-500" />,
};

const Overview = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const [activities, setActivities] = useState<any[]>([]);
    const [activityLoading, setActivityLoading] = useState(true);

    useEffect(() => {
        const fetchRecentActivity = async () => {
            if (!user) return;

            try {
                setActivityLoading(true);
                const [consultations, prescriptions, labResults, history] = await Promise.all([
                    supabase.from('consultations').select('id, created_at, diagnosis').eq('patient_id', user.id).order('created_at', { ascending: false }).limit(3),
                    supabase.from('prescriptions').select('id, created_at, medication').eq('patient_id', user.id).order('created_at', { ascending: false }).limit(3),
                    supabase.from('lab_results').select('id, created_at, test_name').eq('patient_id', user.id).order('created_at', { ascending: false }).limit(3),
                    supabase.from('medical_histories').select('id, diagnosis_date, condition').eq('patient_id', user.id).order('diagnosis_date', { ascending: false }).limit(3)
                ]);

                const allActivities = [
                    ...(consultations.data || []).map(c => ({ type: 'consultation', date: c.created_at, description: `Diagnosis: ${c.diagnosis || 'Pending'}` })),
                    ...(prescriptions.data || []).map(p => ({ type: 'prescription', date: p.created_at, description: `Medication: ${p.medication}` })),
                    ...(labResults.data || []).map(l => ({ type: 'lab_result', date: l.created_at, description: `Test: ${l.test_name}` })),
                    ...(history.data || []).map(h => ({ type: 'history', date: h.diagnosis_date, description: `New Condition: ${h.condition}` }))
                ];

                const sortedActivities = allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
                setActivities(sortedActivities);

            } catch (error: any) {
                toast.error('Failed to fetch recent activity', { description: error.message });
            } finally {
                setActivityLoading(false);
            }
        };

        if (user) {
            fetchRecentActivity();
        }
    }, [user]);

    if (authLoading) {
        return <div className="flex justify-center items-center h-96"><BarLoader color="#36d7b7" /></div>;
    }

    if (!user || !profile) {
        return <Card><CardHeader><CardTitle>Error</CardTitle></CardHeader><CardContent><p>Could not load patient information.</p></CardContent></Card>;
    }

    const getInitials = (name: string | undefined) => !name ? 'U' : name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-muted/40 pb-4 p-6">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                        <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
                        <AvatarFallback className="text-3xl">{getInitials(profile.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="pt-2">
                        <CardTitle className="text-2xl font-bold">{profile.full_name}</CardTitle>
                        <CardDescription className="text-md">Here is a summary of your personal and medical information.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                    <InfoRow icon={<User className="h-5 w-5 text-primary" />} label="Full Name" value={profile.full_name} />
                    <InfoRow icon={<Mail className="h-5 w-5 text-primary" />} label="Email Address" value={user.email} />
                    <InfoRow icon={<Phone className="h-5 w-5 text-primary" />} label="Phone Number" value={profile.phone} />
                    <InfoRow 
                        icon={<Cake className="h-5 w-5 text-primary" />} 
                        label="Date of Birth" 
                        value={profile.date_of_birth ? format(new Date(profile.date_of_birth), 'MMMM d, yyyy') : undefined} 
                    />
                    <InfoRow icon={<VenetianMask className="h-5 w-5 text-primary" />} label="Sex at Birth" value={profile.sex_at_birth} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of your recent consultations and medical events.</CardDescription>
                </CardHeader>
                <CardContent>
                    {activityLoading ? (
                         <div className="flex justify-center items-center h-48">
                            <BarLoader color="#36d7b7" height={4} width={150} />
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="flow-root">
                            <ul>
                                {activities.map((activity, index) => (
                                    <ActivityItem 
                                        key={index}
                                        icon={activityIcons[activity.type]}
                                        title={activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        description={activity.description}
                                        date={activity.date}
                                    />
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No recent activity to display.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Overview;
