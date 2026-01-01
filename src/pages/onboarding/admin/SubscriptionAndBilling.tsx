
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionAndBillingProps {
  data: {
    plan: string;
  };
  updateData: (data: Partial<{ plan: string }>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const plans = [
    {
        name: "Basic",
        price: "$49/mo",
        features: ["Up to 10 doctors", "Basic analytics", "Email support"],
        isPopular: false,
    },
    {
        name: "Professional",
        price: "$99/mo",
        features: ["Up to 50 doctors", "Advanced analytics", "Priority email support", "Telemedicine integration"],
        isPopular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        features: ["Unlimited doctors", "Dedicated account manager", "On-premise deployment", "24/7 phone support"],
        isPopular: false,
    },
];

const SubscriptionAndBilling = ({ data, updateData, onNext, onPrev }: SubscriptionAndBillingProps) => {

    const selectPlan = (planName: string) => {
        updateData({ plan: planName });
    }

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold">Choose Your Plan</h2>
            <p className="text-muted-foreground">Select the best plan that fits your organization's needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
                 <Card key={plan.name} className={cn("flex flex-col", { "border-primary border-2": data.plan === plan.name, "relative": plan.isPopular } )}>
                    {plan.isPopular && (
                        <div className="absolute top-0 right-4 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <Star className="h-4 w-4" /> Most Popular
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <div className="text-4xl font-extrabold">{plan.price}</div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-3">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            variant={data.plan === plan.name ? 'default' : 'outline'} 
                            onClick={() => selectPlan(plan.name)}>
                                {data.plan === plan.name ? "Selected" : "Choose Plan"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>

        <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrev}>Previous</Button>
            <Button onClick={onNext} disabled={!data.plan}>Next</Button>
        </div>
    </div>
  );
};

export default SubscriptionAndBilling;
