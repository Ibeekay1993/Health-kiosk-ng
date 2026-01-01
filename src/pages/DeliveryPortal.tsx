
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, CheckCircle, Clock, Navigation, User, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

const StatCard = ({ title, value, icon, color, loading }: { title: string, value: string | number, icon: React.ReactNode, color: string, loading: boolean }) => (
  <Card className={`border-l-4 border-${color}-500`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{value}</div>}
    </CardContent>
  </Card>
);

const OrderCard = ({ order, onAccept }: { order: any, onAccept: (orderId: string) => void }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex-1 mb-4 sm:mb-0">
        <div className="font-bold text-primary mb-1">{order.id}</div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <User className="h-4 w-4 mr-2" />
          {order.patient_name || 'N/A'}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          {order.delivery_address || 'N/A'}
        </div>
      </div>
      <div className="flex items-center w-full sm:w-auto">
        <div className="text-center mr-4 flex-1">
          <div className="font-semibold text-lg">{`₦${order.total_amount || 0}`}</div>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => onAccept(order.id)}>Accept</Button>
      </div>
    </CardContent>
  </Card>
);

const ActiveDeliveryCard = ({ delivery, onDelivered }: { delivery: any, onDelivered: (orderId: string) => void }) => (
  <Card className="bg-secondary/20">
    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex-1 mb-4 sm:mb-0">
        <div className="font-bold text-primary mb-1">{delivery.id}</div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <User className="h-4 w-4 mr-2" />
          {delivery.patient_name || 'N/A'}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          {delivery.delivery_address || 'N/A'}
        </div>
      </div>
      <div className="flex items-center w-full sm:w-auto">
        <div className="text-right mr-4">
          <Badge>{delivery.status}</Badge>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full"><Navigation className="h-4 w-4 mr-2" />Navigate</Button>
          <Button size="sm" className="w-full" onClick={() => onDelivered(delivery.id)}><CheckCircle className="h-4 w-4 mr-2" />Delivered</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const DeliveryPortal = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [pickups, setPickups] = useState<any[]>([]);
  const [active, setActive] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_delivery_dashboard', { p_rider_id: user.id });
      if(error) throw error;
      setStats({
        pending: data.pending_pickups_count,
        inTransit: data.active_deliveries_count,
        delivered: data.completed_today_count,
        totalEarnings: data.earnings_today
      })
      setPickups(data.available_pickups.map((p: any) => ({...p, patient_name: p.patient_full_name, total_amount: p.order_total_amount, delivery_address: p.order_delivery_address, id: p.order_id})))
      setActive(data.active_deliveries.map((d: any) => ({...d, patient_name: d.patient_full_name, total_amount: d.order_total_amount, delivery_address: d.order_delivery_address, id: d.order_id})))
      setHistory(data.completed_deliveries.map((h: any) => ({...h, patient_name: h.patient_full_name, total_amount: h.order_total_amount, delivery_address: h.order_delivery_address, id: h.order_id})))
    } catch (err: any) {
      toast.error('Error fetching data', { description: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAccept = async (orderId: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: 'in_transit', delivery_rider_id: user?.id }).eq('id', orderId);
      if(error) throw error;
      toast.success('Order Accepted!', { description: 'The order is now in your active deliveries.'});
      fetchData();
    } catch(err: any) {
      toast.error('Failed to accept order', { description: err.message });
    }
  }

  const handleDelivered = async (orderId: string) => {
     try {
      const { error } = await supabase.from('orders').update({ status: 'delivered' }).eq('id', orderId);
      if(error) throw error;
      toast.success('Order Delivered!', { description: 'The order has been marked as delivered.'});
      fetchData();
    } catch(err: any) {
      toast.error('Failed to mark as delivered', { description: err.message });
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Delivery Dashboard</h1>
            <p className="text-muted-foreground mt-2">Real-time overview of all delivery activities.</p>
          </div>
          <Button onClick={fetchData} variant="outline"><Loader2 className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard loading={loading} title="Pending Pickups" value={stats.pending || 0} icon={<Package className="h-6 w-6 text-yellow-500" />} color="yellow" />
          <StatCard loading={loading} title="In Transit" value={stats.inTransit || 0} icon={<Navigation className="h-6 w-6 text-blue-500" />} color="blue" />
          <StatCard loading={loading} title="Delivered Today" value={stats.delivered || 0} icon={<CheckCircle className="h-6 w-6 text-green-500" />} color="green" />
          <StatCard loading={loading} title="Today's Earnings" value={`₦${(stats.totalEarnings || 0).toLocaleString()}`} icon={<Clock className="h-6 w-6 text-indigo-500" />} color="indigo" />
        </div>

        <Tabs defaultValue="pickups" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 h-auto">
            <TabsTrigger value="pickups">Available Pickups</TabsTrigger>
            <TabsTrigger value="active">Active Deliveries</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>
          <TabsContent value="pickups">
            <Card>
              <CardHeader>
                <CardTitle>Available for Pickup</CardTitle>
                <CardDescription>These orders are ready to be collected and delivered.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? <div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto"/></div> : pickups.length > 0 ? pickups.map((order) => (<OrderCard key={order.id} order={order} onAccept={handleAccept} />)) : <p className="text-muted-foreground text-center">No available pickups.</p>}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Deliveries</CardTitle>
                <CardDescription>These orders are currently in transit.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {loading ? <div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto"/></div> : active.length > 0 ? active.map((delivery) => (<ActiveDeliveryCard key={delivery.id} delivery={delivery} onDelivered={handleDelivered} />)) : <p className="text-muted-foreground text-center">No active deliveries.</p>}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Completed Deliveries</CardTitle>
                <CardDescription>A log of all your completed deliveries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {loading ? <div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto"/></div> : history.length > 0 ? history.map((delivery) => (<ActiveDeliveryCard key={delivery.id} delivery={delivery} onDelivered={() => {}} />)) : <p className="text-muted-foreground text-center">No completed deliveries to show yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeliveryPortal;
