
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const PatientOnboarding = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [sexAtBirth, setSexAtBirth] = useState('');
    const [consent, setConsent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("You must be logged in to complete your profile.");
            return;
        }
        if (!consent) {
            toast.error("You must consent to the processing of your health information to continue.");
            return;
        }

        setLoading(true);

        const { error } = await supabase
            .from('profiles')
            .update({
                date_of_birth: dateOfBirth,
                sex_at_birth: sexAtBirth,
                consent_to_health_data: true,
                status: 'active'
            })
            .eq('id', user.id);

        setLoading(false);

        if (error) {
            toast.error("Failed to save profile", { description: error.message });
        } else {
            toast.success("Profile completed successfully!");
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Complete Your Patient Profile</CardTitle>
                    <CardDescription>
                        Please provide a few essential details to complete your profile.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="date_of_birth">Date of Birth</Label>
                            <Input id="date_of_birth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sex_at_birth">Sex at Birth</Label>
                            <Select onValueChange={setSexAtBirth} value={sexAtBirth} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your sex at birth" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="intersex">Intersex</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground pt-1">
                                This information is used for clinical safety and helps us provide you with the best care.
                            </p>
                        </div>
                        <div className="items-top flex space-x-2 pt-2">
                            <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked as boolean)} />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="consent"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Consent to Health Information
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    I consent to the collection and processing of my health information.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading || !consent}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Profile"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default PatientOnboarding;
