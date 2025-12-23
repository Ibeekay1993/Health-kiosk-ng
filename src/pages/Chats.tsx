import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Chats = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Chats</h1>
      <Card>
        <CardHeader>
          <CardTitle>Secure Messaging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 border rounded-lg p-4 mb-4 overflow-y-auto">
            {/* Chat messages will go here */}
            <p className="text-muted-foreground">No messages yet. Start a conversation with your provider.</p>
          </div>
          <div className="flex gap-4">
            <Input placeholder="Type your message..." />
            <Button>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chats;
