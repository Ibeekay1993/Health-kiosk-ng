import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LaboratoryRequests = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Laboratory Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Test Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You have no pending laboratory requests.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaboratoryRequests;
