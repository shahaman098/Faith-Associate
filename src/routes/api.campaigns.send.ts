import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendMassEmailWithOptions } from "@/lib/mass-email";

const sendSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  subject: z.string().trim().min(3).max(200),
  html: z.string().trim().min(1).max(200_000),
  text: z.string().trim().max(200_000).optional().or(z.literal("")),
  recipients: z.array(z.string().trim().email().max(255)).min(1).max(20_000).optional(),
});

type CampaignStatus = "queued" | "sending" | "completed" | "failed";
type RecipientStatus = "queued" | "sent" | "failed";

export const Route = createFileRoute("/api/campaigns/send")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
      POST: async ({ request }) => {
        const corsHeaders = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const parsed = sendSchema.safeParse(raw);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: "Validation failed", details: parsed.error.issues }),
            { status: 400, headers: corsHeaders },
          );
        }

        const data = parsed.data;
        const db = supabaseAdmin;

        try {
          const recipients = data.recipients?.length
            ? Array.from(new Set(data.recipients.map((email) => email.trim().toLowerCase())))
            : [];

          if (recipients.length === 0) {
            const { data: contactRows, error: contactsError } = await db
              .from("contacts")
              .select("email")
              .not("email", "is", null);

            if (contactsError) {
              throw contactsError;
            }

            for (const row of contactRows ?? []) {
              const email = String(row.email ?? "")
                .trim()
                .toLowerCase();
              if (email) recipients.push(email);
            }
          }

          const dedupedRecipients = Array.from(new Set(recipients));
          if (dedupedRecipients.length === 0) {
            return new Response(JSON.stringify({ error: "No recipients found" }), {
              status: 400,
              headers: corsHeaders,
            });
          }

          const { data: campaignRow, error: campaignError } = await db
            .from("email_campaigns")
            .insert({
              name: data.name || `Campaign ${new Date().toISOString()}`,
              subject: data.subject,
              html: data.html,
              text: data.text || null,
              status: "queued" satisfies CampaignStatus,
              total_recipients: dedupedRecipients.length,
            })
            .select("id")
            .single();

          if (campaignError || !campaignRow) {
            throw campaignError ?? new Error("Failed to create campaign");
          }

          const campaignId = campaignRow.id as string;
          const recipientRows = dedupedRecipients.map((email) => ({
            campaign_id: campaignId,
            recipient: email,
            status: "queued" satisfies RecipientStatus,
          }));

          const { error: recipientsError } = await db
            .from("email_campaign_recipients")
            .insert(recipientRows);
          if (recipientsError) {
            throw recipientsError;
          }

          await db
            .from("email_campaigns")
            .update({
              status: "sending" satisfies CampaignStatus,
              started_at: new Date().toISOString(),
            })
            .eq("id", campaignId);

          const result = await sendMassEmailWithOptions(
            {
              subject: data.subject,
              html: data.html,
              ...(data.text ? { text: data.text } : {}),
            },
            {
              recipients: dedupedRecipients,
              onBatchResult: async ({ batch, ok, error }) => {
                const status = ok
                  ? ("sent" satisfies RecipientStatus)
                  : ("failed" satisfies RecipientStatus);
                await db
                  .from("email_campaign_recipients")
                  .update({
                    status,
                    error_message: error ?? null,
                    sent_at: ok ? new Date().toISOString() : null,
                  })
                  .eq("campaign_id", campaignId)
                  .in("recipient", batch);
              },
            },
          );

          const finalStatus: CampaignStatus =
            result.failed > 0 && result.sent === 0
              ? "failed"
              : result.failed > 0
                ? "completed"
                : "completed";

          await db
            .from("email_campaigns")
            .update({
              status: finalStatus,
              sent_count: result.sent,
              failed_count: result.failed,
              completed_at: new Date().toISOString(),
            })
            .eq("id", campaignId);

          return new Response(
            JSON.stringify({
              ok: true,
              campaign_id: campaignId,
              total_recipients: dedupedRecipients.length,
              sent: result.sent,
              failed: result.failed,
            }),
            { status: 201, headers: corsHeaders },
          );
        } catch (error) {
          console.error("Campaign send failed", error);
          return new Response(JSON.stringify({ error: "Failed to send campaign" }), {
            status: 500,
            headers: corsHeaders,
          });
        }
      },
    },
  },
});
