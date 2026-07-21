import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_app/payments")({
  component: () => (
    <div>
      <PageHeader title="Payments" description="Awaiting and paid enrolments." />
      <div className="px-6 py-6 md:px-10">
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Payments overview coming next — manage from each application's detail page for now.
          </CardContent>
        </Card>
      </div>
    </div>
  ),
});
