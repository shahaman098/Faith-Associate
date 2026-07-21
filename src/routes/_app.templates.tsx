import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/templates")({
  component: Templates,
});

function Templates() {
  const [rows, setRows] = useState<
    Array<{ id: string; key: string; name: string; subject: string }>
  >([]);

  useEffect(() => {
    void supabase
      .from("email_templates")
      .select("id, key, name, subject")
      .order("name")
      .then(({ data }) => {
        if (data) setRows(data);
      });
  }, []);

  return (
    <div>
      <PageHeader
        title="Email templates"
        description="Templates used by automations and manual sends."
      />
      <div className="px-6 py-6 md:px-10">
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <CardTitle className="text-base">{r.name}</CardTitle>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{r.key}</p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{r.subject}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
