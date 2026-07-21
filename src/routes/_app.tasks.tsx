import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_app/tasks")({
  component: () => (
    <div>
      <PageHeader title="Tasks" description="Follow-ups and reminders." />
      <div className="px-6 py-6 md:px-10">
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Tasks list coming next — schema is ready.
          </CardContent>
        </Card>
      </div>
    </div>
  ),
});
