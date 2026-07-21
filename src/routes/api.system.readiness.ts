import { createFileRoute } from "@tanstack/react-router";

const EXPO_TABLES = [
  "expo_events",
  "expo_packages",
  "expo_exhibitors",
  "expo_meetings",
  "expo_invoices",
  "expo_attendees",
  "expo_onboarding_checklists",
] as const;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function checkTable(baseUrl: string, apiKey: string, table: (typeof EXPO_TABLES)[number]) {
  const response = await fetch(`${baseUrl}/rest/v1/${table}?select=id&limit=1`, {
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (response.ok) {
    return { table, ready: true as const };
  }

  const message = await response.text();
  return {
    table,
    ready: false as const,
    status: response.status,
    message,
  };
}

export const Route = createFileRoute("/api/system/readiness")({
  server: {
    handlers: {
      GET: async () => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
        const serviceRoleConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

        if (!supabaseUrl || !publishableKey) {
          return json(
            {
              ready: false,
              serviceRoleConfigured,
              expoConfigured: false,
              missingTables: EXPO_TABLES,
              issues: ["Missing SUPABASE_URL or public Supabase key."],
            },
            500,
          );
        }

        const checks = await Promise.all(
          EXPO_TABLES.map((table) => checkTable(supabaseUrl, publishableKey, table)),
        );
        const missingTables = checks.filter((check) => !check.ready).map((check) => check.table);
        const issues = checks
          .filter((check) => !check.ready)
          .map((check) => `${check.table}: ${check.status} ${check.message}`);

        return json({
          ready: serviceRoleConfigured && missingTables.length === 0,
          serviceRoleConfigured,
          expoConfigured: missingTables.length === 0,
          missingTables,
          issues,
        });
      },
    },
  },
});
