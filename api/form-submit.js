const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FORM_TO_EMAIL = process.env.FORM_TO_EMAIL || "hello@belarro.com";
const FORM_FROM_EMAIL = process.env.FORM_FROM_EMAIL || "Belarro Forms <hello@belarro.com>";

function json(status, body) {
  return {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify(body),
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatList(items) {
  if (!Array.isArray(items) || items.length === 0) return "None";
  return items.join(", ");
}

function buildSubject(payload) {
  if (payload.form_type === "contact") {
    return payload.locale === "de" ? "Neue Kontaktanfrage" : "New contact message";
  }

  const intentMap = {
    inquiry: payload.locale === "de" ? "Allgemeine Anfrage" : "General inquiry",
    samples: payload.locale === "de" ? "Musteranfrage" : "Sample request",
    visit: payload.locale === "de" ? "Küchenbesuch" : "Kitchen visit",
    weekly: payload.locale === "de" ? "Wöchentliche Belieferung" : "Weekly setup",
  };

  return intentMap[payload.intent] || (payload.locale === "de" ? "Neue Anfrage" : "New request");
}

function buildEmailHtml(payload) {
  const rows = [
    ["Form", payload.form_type],
    ["Intent", payload.intent],
    ["Restaurant", payload.restaurant_name],
    ["Name", payload.contact_name],
    ["Email", payload.email],
    ["Phone", payload.phone],
    ["Subject", payload.subject],
    ["Preferred Days", formatList(payload.preferred_days)],
    ["Preferred Times", formatList(payload.preferred_times)],
    ["Sample Requests", payload.sample_varieties],
    ["Address", payload.delivery_address],
    ["Notes", payload.notes],
    ["Message", payload.message],
    ["Locale", payload.locale],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `<!doctype html>
  <html>
    <body style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
      <h2 style="margin:0 0 16px;">${escapeHtml(buildSubject(payload))}</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">
        ${tableRows}
      </table>
    </body>
  </html>`;
}

async function saveSubmission(payload) {
  const submission = {
    form_type: payload.form_type,
    intent: payload.intent || null,
    restaurant_name: payload.restaurant_name || null,
    contact_name: payload.contact_name || null,
    email: payload.email || null,
    phone: payload.phone || null,
    subject: payload.subject || null,
    sample_varieties: payload.sample_varieties || null,
    delivery_address: payload.delivery_address || null,
    preferred_days: payload.preferred_days?.length ? payload.preferred_days : null,
    preferred_times: payload.preferred_times?.length ? payload.preferred_times : null,
    notes: payload.notes || null,
    message: payload.message || null,
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/form_submissions`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    throw new Error(`Supabase save failed: ${response.status}`);
  }
}

async function sendNotificationEmail(payload) {
  if (!RESEND_API_KEY) return { sent: false, reason: "missing_resend_key" };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FORM_FROM_EMAIL,
      to: [FORM_TO_EMAIL],
      reply_to: payload.email || undefined,
      subject: `[Belarro] ${buildSubject(payload)}`,
      html: buildEmailHtml(payload),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend failed: ${response.status} ${errorText}`);
  }

  return { sent: true };
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    const response = json(200, { ok: true });
    res.status(response.status).setHeader("Content-Type", "application/json");
    Object.entries(response.headers).forEach(([key, value]) => res.setHeader(key, value));
    return res.send(response.body);
  }

  if (req.method !== "POST") {
    const response = json(405, { error: "Method not allowed" });
    res.status(response.status).setHeader("Content-Type", "application/json");
    Object.entries(response.headers).forEach(([key, value]) => res.setHeader(key, value));
    return res.send(response.body);
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const response = json(500, { error: "Server configuration is incomplete" });
    res.status(response.status).setHeader("Content-Type", "application/json");
    Object.entries(response.headers).forEach(([key, value]) => res.setHeader(key, value));
    return res.send(response.body);
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!payload?.form_type || !payload?.email) {
      const response = json(400, { error: "Missing required fields" });
      res.status(response.status).setHeader("Content-Type", "application/json");
      Object.entries(response.headers).forEach(([key, value]) => res.setHeader(key, value));
      return res.send(response.body);
    }

    await saveSubmission(payload);

    let emailResult = { sent: false, reason: "not_attempted" };
    try {
      emailResult = await sendNotificationEmail(payload);
    } catch (emailError) {
      console.error("form-submit email error", emailError);
    }

    const response = json(200, { ok: true, emailSent: emailResult.sent });
    res.status(response.status).setHeader("Content-Type", "application/json");
    Object.entries(response.headers).forEach(([key, value]) => res.setHeader(key, value));
    return res.send(response.body);
  } catch (error) {
    const response = json(500, { error: "Submission failed" });
    res.status(response.status).setHeader("Content-Type", "application/json");
    Object.entries(response.headers).forEach(([key, value]) => res.setHeader(key, value));
    console.error("form-submit error", error);
    return res.send(response.body);
  }
}
