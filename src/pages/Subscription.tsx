import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";

const Subscription = () => {
  const plans = [
    {
      name: "PayG (Local GP) NGN",
      price: "₦1,000",
      period: "Year",
      users: "Up to 1 Adults and up to 1 Children",
      features: [
        "Pharmacy Advise",
        "Prescription Reminder",
        "Access Through Chat Bot",
        "Health Education Session",
        "Diagnostic Request",
      ],
    },
    {
      name: "PayG (Local Specialist) NGN",
      price: "₦5,000",
      period: "Year",
      users: "Up to 1 Adults and up to 1 Children",
      features: ["Prescriptions", "1 Local Consultations"],
      popular: true,
    },
    {
      name: "Mega Value Plan NGN",
      price: "₦5,000",
      period: "Year",
      users: "Up to 6 Adults and up to 6 Children",
      features: [
        "Pharmacy Advise",
        "Access Through Chat Bot",
        "Health Education Session",
        "Diagnostic Request",
        "Prescriptions",
      ],
    },
  ];

  return (
    <div className="bg-muted/40 min-h-screen p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Affordable & Flexible Healthcare Plans</h1>
          <p className="mt-3 text-lg text-muted-foreground">Choose a plan that fits your needs and budget, from basic care to premium global access.</p>
        </div>

        <div className="flex justify-center mb-8">
          <Button variant="link">View All Subscription History</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`flex flex-col ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && <div className="bg-primary text-primary-foreground text-sm font-semibold text-center py-1 rounded-t-lg">Most Popular</div>}
              <CardHeader className="items-center text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.users}</CardDescription>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-xl font-medium text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-auto">Get started</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
