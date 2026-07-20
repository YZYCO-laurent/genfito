/**
 * Genfito Email Sequence API
 * POST /api/email-sequence
 *
 * Sends 3 post-quiz emails via Resend:
 *   Email 1 — immediately (Score Reveal)
 *   Email 2 — 24h later (Two Paths + Product)
 *   Email 3 — 48h later (Social Proof + Science)
 *
 * Body: { email, rollercoaster_score, ride_type, goal_weight, goal_gap, cta_url }
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'GENFITO';
const BASE_URL = 'https://genfito.com';

// Ride type display data
const RIDE_TYPE_DATA = {
  sugar_craver: {
    label: 'The Sugar-Craver',
    desc: 'Cravings run the show — especially for something sweet.',
    icon: '🎢',
    zone: 'WILD RIDE',
    zone_color: '#C0392B',
    tags: ['Cravings after meals', 'The Sugar-Craver', 'Weight crept up'],
    ingredient_highlight: 'One of the five is traditionally called the "sugar destroyer" for how it dulls the taste for sweet.',
  },
  energy_crasher: {
    label: 'The Energy Crasher',
    desc: 'Your afternoons hit a wall — hard.',
    icon: '⚡',
    zone: 'ROUGH RIDE',
    zone_color: '#E67E22',
    tags: ['Afternoon crash', 'Energy dips', 'Brain fog'],
    ingredient_highlight: 'One of the five directly supports mitochondrial energy production — the root of afternoon crashes.',
  },
  stress_eater: {
    label: 'The Stress Eater',
    desc: 'Cortisol spikes send you straight to the snack drawer.',
    icon: '😤',
    zone: 'BUMPY RIDE',
    zone_color: '#E67E22',
    tags: ['Stress eating', 'Emotional hunger', 'Cortisol spikes'],
    ingredient_highlight: 'One of the five is an adaptogen that directly blunts cortisol-driven glucose spikes.',
  },
  night_snacker: {
    label: 'The Night Snacker',
    desc: 'Late-night hunger keeps your blood sugar from settling.',
    icon: '🌙',
    zone: 'BUMPY RIDE',
    zone_color: '#E67E22',
    tags: ['Late-night hunger', 'Poor sleep quality', 'Evening cravings'],
    ingredient_highlight: 'One of the five supports overnight glucose regulation — so you wake up without the morning hunger spike.',
  },
  plateau_fighter: {
    label: 'The Plateau Fighter',
    desc: 'You\'re doing everything right but the scale won\'t budge.',
    icon: '🏔️',
    zone: 'STUCK RIDE',
    zone_color: '#7F8C8D',
    tags: ['Weight plateau', 'Insulin resistance', 'Metabolic slowdown'],
    ingredient_highlight: 'One of the five specifically targets insulin sensitivity — the hidden driver of weight loss plateaus.',
  },
};

// Get gauge image URL for a score
function getGaugeUrl(score) {
  const bracket = Math.round(score / 10) * 10;
  const clamped = Math.max(0, Math.min(100, bracket));
  return `${BASE_URL}/images/gauge/gauge_${clamped}.png`;
}

// Replace template variables in HTML
function fillTemplate(html, vars) {
  return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return vars[key] !== undefined ? vars[key] : match;
  });
}

// Build Email 1 HTML inline (Score Reveal)
function buildEmail1(vars) {
  const rt = RIDE_TYPE_DATA[vars.ride_type_key] || RIDE_TYPE_DATA.sugar_craver;
  const score = parseInt(vars.rollercoaster_score) || 72;
  const gaugeUrl = getGaugeUrl(score);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Your Blood Sugar Rollercoaster Score</title>
<style>
@media only screen and (max-width:600px){
  .email-wrapper{width:100%!important;}
  .email-body{padding:16px!important;}
  .score-number{font-size:52px!important;}
  .cta-button{font-size:15px!important;padding:14px 20px!important;}
}
</style>
</head>
<body style="margin:0;padding:0;background-color:#EBF3FA;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Your score is ${score}/100 — here's what it means for your blood sugar.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EBF3FA;">
<tr><td align="center" style="padding:24px 16px;">
<table class="email-wrapper" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
  <!-- Header -->
  <tr><td align="center" style="padding:20px 0 16px;">
    <img src="${BASE_URL}/images/logo_icon.png" alt="GENFITO" width="48" height="48" style="display:block;margin:0 auto 6px;" />
    <div style="font-size:13px;font-weight:700;letter-spacing:2px;color:#1B3A5C;">GENFITO</div>
  </td></tr>
  <!-- Score Card -->
  <tr><td style="background:#FFFFFF;border-radius:16px;padding:32px 28px;text-align:center;">
    <div style="font-size:13px;font-weight:600;color:#6B7280;letter-spacing:1px;margin-bottom:8px;">YOUR ROLLERCOASTER SCORE:</div>
    <div class="score-number" style="font-size:72px;font-weight:900;color:#1B3A5C;line-height:1;">${score}</div>
    <div style="font-size:22px;font-weight:400;color:#6B7280;">/100</div>
    <div style="margin:16px auto;background:#F0F4F8;border-radius:8px;padding:12px 16px;max-width:320px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:28px;">${rt.icon}</span>
      <div style="text-align:left;">
        <div style="font-size:16px;font-weight:700;color:#1B3A5C;">YOUR RIDE TYPE:</div>
        <div style="font-size:18px;font-weight:800;color:#1B3A5C;">${rt.label}</div>
        <div style="font-size:13px;color:#6B7280;">${rt.desc}</div>
      </div>
    </div>
    <div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#1B3A5C;margin-bottom:8px;">ROLLERCOASTER SCORE</div>
    <img src="${gaugeUrl}" alt="Score gauge showing ${score}/100" width="280" height="160" style="display:block;margin:0 auto;" />
    <div style="background:${rt.zone_color};color:#FFFFFF;font-size:12px;font-weight:700;letter-spacing:1px;padding:6px 16px;border-radius:20px;display:inline-block;margin-top:12px;">YOU'RE IN THE "${rt.zone}" ZONE</div>
    <div style="font-size:11px;color:#9CA3AF;margin-top:12px;">Your Rollercoaster Score is a self-reported pattern read from your answers — not a medical or blood-sugar measurement.</div>
  </td></tr>
  <!-- Based on your answers -->
  <tr><td style="padding:24px 0 0;">
    <div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#1B3A5C;text-align:center;margin-bottom:16px;">BASED ON YOUR ANSWERS</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        ${rt.tags.map(tag => `<td style="background:#F0F4F8;border-radius:8px;padding:8px 12px;text-align:center;font-size:12px;font-weight:600;color:#1B3A5C;width:33%;">${tag}</td>`).join('<td width="8"></td>')}
      </tr>
    </table>
    <div style="background:#FFFFFF;border-radius:12px;padding:16px 20px;margin-top:16px;">
      <div style="font-size:15px;font-weight:700;color:#1B3A5C;margin-bottom:6px;">This isn't about willpower — it's a pattern you can calm.</div>
      <div style="font-size:13px;color:#6B7280;">The good news: with the right plan, you can break the cycle and feel steady, satisfied, and in control.</div>
    </div>
  </td></tr>
  <!-- Testimonial -->
  <tr><td style="padding:24px 0 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
      <tr>
        <td width="160" style="padding:0;vertical-align:middle;">
          <img src="${BASE_URL}/images/testimonial_sharon.png" alt="Sharon testimonial" width="160" style="display:block;width:160px;" />
        </td>
        <td style="padding:20px;vertical-align:middle;">
          <div style="font-size:15px;font-style:italic;color:#1B3A5C;margin-bottom:12px;">"The 3pm crash is just... gone. I'm not raiding the pantry every afternoon anymore."</div>
          <div style="font-size:22px;font-weight:800;color:#1B3A5C;">4.8 / 5</div>
          <div style="color:#F59E0B;font-size:18px;">★★★★★</div>
          <div style="font-size:12px;color:#9CA3AF;">From 12,543 users</div>
        </td>
      </tr>
    </table>
  </td></tr>
  <!-- CTA -->
  <tr><td style="background:#1B3A5C;border-radius:16px;padding:28px;text-align:center;margin-top:24px;">
    <a href="${vars.cta_url}" style="display:inline-block;background:#C0392B;color:#FFFFFF;font-size:16px;font-weight:700;letter-spacing:1px;text-decoration:none;padding:16px 32px;border-radius:8px;">SEE MY FULL RESULT →</a>
    <div style="font-size:13px;color:#BDC3C7;margin-top:12px;">Your full breakdown — what's driving your ride, and the simple daily routine that calms it.</div>
  </td></tr>
  <!-- Footer -->
  <tr><td style="padding:24px 0;text-align:center;">
    <img src="${BASE_URL}/images/logo_icon.png" alt="GENFITO" width="32" height="32" style="display:block;margin:0 auto 8px;" />
    <div style="font-size:11px;color:#9CA3AF;max-width:480px;margin:0 auto;">
      If you no longer wish to receive emails from GENFITO, <a href="${vars.unsubscribe_url || '#'}" style="color:#6B7280;">click here</a> to Unsubscribe from our mailing list.<br/><br/>
      Disclaimer: Content and statements on this website have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. It should not be substituted for medical advice or medical intervention. Please consult a qualified healthcare provider when making medical decisions.<br/><br/>
      © 2026 Genfito. All rights reserved.
    </div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// Send a single email via Resend
async function sendEmail({ to, subject, html, scheduledAt }) {
  const body = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [to],
    subject,
    html,
  };
  if (scheduledAt) {
    body.scheduled_at = scheduledAt;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Resend error: ${JSON.stringify(data)}`);
  }
  return data;
}

// Read an email template file and fill variables
async function getEmailTemplate(templateName, vars) {
  // Templates are stored as static HTML files in /emails/
  // In production on Vercel, we read them from the filesystem
  const fs = await import('fs');
  const path = await import('path');
  const templatePath = path.join(process.cwd(), 'emails', templateName);
  let html = fs.readFileSync(templatePath, 'utf8');
  return fillTemplate(html, vars);
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  const {
    email,
    rollercoaster_score = 72,
    ride_type = 'sugar_craver',
    goal_weight = '',
    goal_gap = '',
    cta_url = 'https://genfito.com/quiz',
  } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const rt = RIDE_TYPE_DATA[ride_type] || RIDE_TYPE_DATA.sugar_craver;

  const vars = {
    email,
    rollercoaster_score: String(rollercoaster_score),
    ride_type: rt.label,
    ride_type_key: ride_type,
    ride_type_desc: rt.desc,
    ride_type_icon: rt.icon,
    ride_type_zone: rt.zone,
    ingredient_highlight: rt.ingredient_highlight,
    goal_weight: goal_weight ? `${goal_weight} lbs` : 'your goal weight',
    goal_gap: goal_gap ? `${goal_gap}` : '',
    cta_url,
    unsubscribe_url: `https://genfito.com/unsubscribe?email=${encodeURIComponent(email)}`,
    gauge_url: getGaugeUrl(parseInt(rollercoaster_score)),
    base_url: BASE_URL,
  };

  const results = { email1: null, email2: null, email3: null, errors: [] };

  // --- Email 1: Send immediately ---
  try {
    const html1 = buildEmail1(vars);
    const r1 = await sendEmail({
      to: email,
      subject: `Your Blood Sugar Rollercoaster Score: ${rollercoaster_score}/100`,
      html: html1,
    });
    results.email1 = r1.id;
  } catch (e) {
    results.errors.push(`email1: ${e.message}`);
  }

  // --- Email 2: Schedule for 24h later ---
  try {
    const html2 = await getEmailTemplate('email2_two_paths.html', vars);
    const send2At = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const r2 = await sendEmail({
      to: email,
      subject: `Two ways the next few months can go — your ${rollercoaster_score}/100 score`,
      html: html2,
      scheduledAt: send2At,
    });
    results.email2 = r2.id;
  } catch (e) {
    results.errors.push(`email2: ${e.message}`);
  }

  // --- Email 3: Schedule for 48h later ---
  try {
    const html3 = await getEmailTemplate('email3_social_proof.html', vars);
    const send3At = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const r3 = await sendEmail({
      to: email,
      subject: `"Around week three, the cravings quieted down."`,
      html: html3,
      scheduledAt: send3At,
    });
    results.email3 = r3.id;
  } catch (e) {
    results.errors.push(`email3: ${e.message}`);
  }

  return res.status(200).json({
    success: true,
    ...results,
  });
}
