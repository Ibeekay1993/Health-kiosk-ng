
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, CheckCircle, Clock, Navigation, Settings } from "lucide-react";

const DeliveryPortal = () => {
  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Delivery Dashboard</h1>
          <p className="text-muted-foreground">Manage deliveries and pickups</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Pickups</p>
                  <h3 className="text-2xl font-bold">6</h3>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Deliveries</p>
                  <h3 className="text-2xl font-bold">3</h3>
                </div>
                <Navigation className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <h3 className="text-2xl font-bold">15</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Earnings</p>
                  <h3 className="text-2xl font-bold">₦12,500</h3>
                </div>
                <Clock className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Pickups */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Available Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">Order #{2000 + i}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>Pickup: MedStore Pharmacy, Ikeja</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Deliver to: 15 Allen Avenue, Ikeja</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">₦800</p>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                    <Button size="sm">Accept Job</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Deliveries */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-secondary/10">
                  <div className="flex-1">
                    <h4 className="font-semibold">Order #{3000 + i}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>Delivering to: 22 Awolowo Road, Ikoyi</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Distance: 3.5 km</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge>In Transit</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Navigate</Button>
                      <Button size="sm">Mark Delivered</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Delivery History</h3>
              <p className="text-sm text-muted-foreground">View past deliveries</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Navigation className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Navigation</h3>
              <p className="text-sm text-muted-foreground">Open maps</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Settings</h3>
              <p className="text-sm text-muted-foreground">Manage profile</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPortal;
