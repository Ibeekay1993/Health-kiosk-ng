import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CreditCard, CheckCircle, Building2, Wallet } from "lucide-react";

const Insurance = () => {
  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Digital Health Financing</h1>
          <p className="text-muted-foreground text-lg">Affordable healthcare coverage for everyone</p>
        </div>

        {/* Coverage Status */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Coverage Status</h2>
                <p className="opacity-90">Not enrolled in any health plan</p>
              </div>
              <Shield className="h-16 w-16 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Micro-Insurance Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Micro-Insurance Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Weekly Plan</CardTitle>
                  <Badge>Popular</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold">₦500</span>
                    <span className="text-muted-foreground">/week</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Affordable weekly contributions</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Up to 3 doctor consultations/week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">50% discount on prescriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Basic lab tests covered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Emergency support</span>
                  </li>
                </ul>
                <Button className="w-full" size="lg">Enroll Now</Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Monthly Plan</CardTitle>
                  <Badge variant="secondary">Best Value</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold">₦1,800</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Save 10% with monthly payment</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Unlimited consultations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">70% discount on prescriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">All lab tests covered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">24/7 emergency support</span>
                  </li>
                </ul>
                <Button className="w-full" variant="secondary" size="lg">Enroll Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* NHIA & HMO Integration */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Link Existing Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">NHIA Integration</h3>
                <p className="text-muted-foreground mb-4">Link your National Health Insurance</p>
                <Button variant="outline" className="w-full">Connect NHIA</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Wallet className="h-16 w-16 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Private HMO</h3>
                <p className="text-muted-foreground mb-4">Connect your private insurance</p>
                <Button variant="outline" className="w-full">Connect HMO</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Card Payment</p>
                  <p className="text-sm text-muted-foreground">Debit/Credit cards</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Wallet className="h-8 w-8 text-secondary" />
                <div>
                  <p className="font-semibold">Mobile Money</p>
                  <p className="text-sm text-muted-foreground">Pay via USSD</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Bank Transfer</p>
                  <p className="text-sm text-muted-foreground">Direct transfer</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insurance;
