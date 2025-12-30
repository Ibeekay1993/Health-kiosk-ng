
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const refereeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

const formSchema = z.object({
  referees: z.array(refereeSchema).min(2, "At least two referees are required"),
});

const RefereeSubmission = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referees: [{ name: "", email: "", phone: "" }, { name: "", email: "", phone: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "referees",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const refereeData = values.referees.map(ref => ({ ...ref, doctor_id: user.id }));

    const { error } = await supabase.from('doctor_referees').insert(refereeData);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await supabase.from('doctors').update({ status: 'pending_review' }).eq('user_id', user.id);
      toast({ title: "Success", description: "Referees submitted successfully." });
      navigate('/doctor-onboarding/review');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referee Submission</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md space-y-4">
                <FormField
                  control={form.control}
                  name={`referees.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referee Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* ... more fields for email and phone ... */}
                <Button type="button" variant="destructive" onClick={() => remove(index)}>Remove Referee</Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ name: "", email: "", phone: "" })}>Add Referee</Button>
            <Button type="submit">Submit Referees</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RefereeSubmission;
