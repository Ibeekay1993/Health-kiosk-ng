
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DocumentSigning = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Signing</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Please sign the following documents to complete your onboarding.</p>
        {/* Add document signing components here */}
        <Button className="mt-4">Submit Signed Documents</Button>
      </CardContent>
    </Card>
  );
};

export default DocumentSigning;
