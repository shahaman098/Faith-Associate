type MassEmailConfig = {
  enabled: boolean;
  apiKey: string;
  from: string;
  recipients: string[];
  batchSize: number;
  batchDelayMs: number;
};

type MassEmailPayload = {
  subject: string;
  html: string;
  text?: string;
};

type SendMassEmailOptions = {
  recipients?: string[];
  onBatchResult?: (result: {
    batch: string[];
    ok: boolean;
    error?: string;
  }) => Promise<void> | void;
};

type SendResult = {
  sent: number;
  failed: number;
};

const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_BATCH_DELAY_MS = 150;

function parseBoolean(value: string | undefined, defaultValue = false) {
  if (value == null || value.trim() === "") return defaultValue;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function parseNumber(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function uniqueEmails(input: string | undefined) {
  if (!input) return [];
  const seen = new Set<string>();
  const emails: string[] = [];
  for (const raw of input.split(",")) {
    const email = raw.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
  }
  return emails;
}

function readConfig(): MassEmailConfig {
  return {
    enabled: parseBoolean(process.env.MASS_EMAIL_ENABLED, false),
    apiKey: process.env.RESEND_API_KEY ?? "",
    from: process.env.EMAIL_FROM ?? "",
    recipients: uniqueEmails(process.env.MASS_EMAIL_RECIPIENTS),
    batchSize: parseNumber(process.env.MASS_EMAIL_BATCH_SIZE, DEFAULT_BATCH_SIZE),
    batchDelayMs: parseNumber(process.env.MASS_EMAIL_BATCH_DELAY_MS, DEFAULT_BATCH_DELAY_MS),
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendBatch(config: MassEmailConfig, batch: string[], payload: MassEmailPayload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: batch,
      subject: payload.subject,
      html: payload.html,
      ...(payload.text ? { text: payload.text } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Mass email request failed (${response.status}): ${body || response.statusText}`,
    );
  }
}

export async function sendMassEmail(payload: MassEmailPayload): Promise<SendResult> {
  return sendMassEmailWithOptions(payload, {});
}

export async function sendMassEmailWithOptions(
  payload: MassEmailPayload,
  options: SendMassEmailOptions,
): Promise<SendResult> {
  const config = readConfig();

  if (!config.enabled) {
    return { sent: 0, failed: 0 };
  }

  const targetRecipients = options.recipients?.length
    ? Array.from(
        new Set(options.recipients.map((email) => email.trim().toLowerCase()).filter(Boolean)),
      )
    : config.recipients;

  if (!config.apiKey || !config.from || targetRecipients.length === 0) {
    console.warn(
      "Mass email is enabled but missing RESEND_API_KEY, EMAIL_FROM or MASS_EMAIL_RECIPIENTS",
    );
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < targetRecipients.length; i += config.batchSize) {
    const batch = targetRecipients.slice(i, i + config.batchSize);
    try {
      await sendBatch(config, batch, payload);
      sent += batch.length;
      await options.onBatchResult?.({ batch, ok: true });
    } catch (err) {
      failed += batch.length;
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Mass email batch failed", {
        batch,
        error: errorMessage,
      });
      await options.onBatchResult?.({ batch, ok: false, error: errorMessage });
    }
    if (i + config.batchSize < targetRecipients.length) {
      await sleep(config.batchDelayMs);
    }
  }

  return { sent, failed };
}
