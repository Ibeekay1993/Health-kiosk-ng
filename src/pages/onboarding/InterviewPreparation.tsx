
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InterviewPreparation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Preparation</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Prepare for your interview. Here are some resources to help you.</p>
        {/* Add interview resources here */}
        <Button className="mt-4">Proceed to Video Interview</Button>
      </CardContent>
    </Card>
  );
};

export default InterviewPreparation;
