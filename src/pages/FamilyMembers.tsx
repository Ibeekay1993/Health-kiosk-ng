import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FamilyMembers = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Family Members</h1>
      <div className="flex justify-between items-center mb-8">
        <p>Manage health records for your family members.</p>
        <Button>Add Family Member</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Family</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You have not added any family members yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyMembers;
