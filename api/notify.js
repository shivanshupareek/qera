import { Resend } from "resend";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json(res, 500, { error: "Server not configured (RESEND_API_KEY)" });
  }

  let email = "";
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    email = String(body?.email || "").trim();
  } catch {
    return json(res, 400, { error: "Invalid JSON" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json(res, 400, { error: "Invalid email" });
  }

  const resend = new Resend(apiKey);

  const to = process.env.NOTIFY_TO || "ops@qera.studio";
  const from = process.env.NOTIFY_FROM || "Qera Studio <onboarding@resend.dev>";

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject: "Qera waitlist signup",
      text: `New signup: ${email}`,
      replyTo: email,
    });

    return json(res, 200, {
      ok: true,
      id: result?.data?.id || null,
      to,
      from,
    });
  } catch (err) {
    return json(res, 500, {
      error: "Failed to send email",
      details: err?.message || String(err),
    });
  }
}

