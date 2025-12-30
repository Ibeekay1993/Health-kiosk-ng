import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Overview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Records</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Please log in to view your medical records.</p>
      </CardContent>
    </Card>
  );
};

export default Overview;
