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
 *
 * All templates are inlined — no filesystem access required (Vercel serverless safe).
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'info@mail.nutrienting.com';
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

// Replace {{variable}} placeholders in a template string
function fillTemplate(html, vars) {
  return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return vars[key] !== undefined ? vars[key] : match;
  });
}

// ─── EMAIL 1: Score Reveal (immediate) ────────────────────────────────────────
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

// ─── EMAIL 2: Two Paths (+24h) ─────────────────────────────────────────────────
function buildEmail2(vars) {
  return fillTemplate(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Two ways the next few months can go</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-wrapper { width: 100% !important; }
      .email-body { padding: 16px !important; }
      .plan-cards-row td { display: block !important; width: 100% !important; padding: 0 0 12px !important; }
      .plan-card { width: 100% !important; }
      .badge-row td { display: block !important; width: 100% !important; padding: 4px 0 !important; }
      .benefit-row td { display: block !important; width: 100% !important; padding: 4px 0 !important; }
      .faq-section { padding: 20px 16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EBF3FA;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Your score was {{rollercoaster_score}}/100. The spikes are the changeable part.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EBF3FA;">
  <tr><td align="center" style="padding:24px 16px;">
    <table class="email-wrapper" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="padding:20px 0 16px;">
        <img src="https://genfito.com/images/logo_icon.png" alt="GENFITO" width="48" height="48" style="display:block;margin:0 auto 6px;" />
        <div style="font-size:13px;font-weight:700;letter-spacing:2px;color:#1B3A5C;">GENFITO</div>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:28px 32px 24px;" align="center">
            <h1 style="margin:0 0 12px;font-size:26px;font-weight:900;color:#1B3A5C;line-height:1.25;text-align:center;">Two ways the next<br />few months can go</h1>
            <p style="margin:0 0 6px;font-size:14px;color:#2980B9;font-weight:600;text-align:center;">Yesterday your answers put you on the rollercoaster ({{rollercoaster_score}}/100).</p>
            <p style="margin:0;font-size:14px;color:#1B3A5C;font-weight:700;text-align:center;">The spikes are the changeable part.</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:20px 24px 8px;" align="center">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#2980B9;letter-spacing:1.5px;text-transform:uppercase;text-align:center;">ON YOUR OWN VS. WITH GENFITO</p>
          </td></tr>
          <tr><td style="padding:0 24px 8px;" align="center">
            <p style="margin:0 0 8px;font-size:13px;color:#555;line-height:1.6;text-align:center;">Left alone, the spike-crash cycle keeps cravings and the slump in charge — and the weight keeps bouncing back.</p>
            <p style="margin:0 0 16px;font-size:13px;color:#555;line-height:1.6;text-align:center;">Calm the spikes, and steady progress toward {{goal_weight}} gets a lot more doable.</p>
          </td></tr>
          <tr><td style="padding:0 24px 20px;" align="center">
            <img src="https://genfito.com/images/comparison_chart.png" alt="On Your Own vs With Genfito comparison chart" width="520" style="display:block;width:100%;max-width:520px;border-radius:8px;" />
            <p style="margin:8px 0 0;font-size:10px;color:#BBBBBB;text-align:center;">Results not guaranteed; most people lose 0.5–1.0 lbs/week with a healthy diet. Individual results vary.</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:24px 28px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#2980B9;letter-spacing:1.5px;text-transform:uppercase;text-align:center;">WHAT ACTUALLY CALMS THE RIDE</p>
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#1B3A5C;text-align:center;line-height:1.3;">Glucose Metabolism Support — built for your type.</h2>
            <p style="margin:0 0 20px;font-size:13px;color:#555;text-align:center;line-height:1.6;">Five-studied ingredients selected to support a healthier post-meal glucose response and calm the cycle that drives cravings and crashes.</p>
            <table class="badge-row" role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:20px;">
              <tr>
                <td style="width:50%;padding:0 6px 10px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#EBF3FA;border-radius:10px;"><tr><td style="padding:12px 14px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="28" style="padding-right:10px;font-size:18px;">💊</td><td><p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#1B3A5C;">Two capsules before your biggest meal.</p></td></tr></table></td></tr></table></td>
                <td style="width:50%;padding:0 0 10px 6px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#EBF3FA;border-radius:10px;"><tr><td style="padding:12px 14px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="28" style="padding-right:10px;font-size:18px;">🔬</td><td><p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#1B3A5C;">3rd-Party Lab Tested</p></td></tr></table></td></tr></table></td>
              </tr>
              <tr>
                <td style="width:50%;padding:0 6px 0 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#EBF3FA;border-radius:10px;"><tr><td style="padding:12px 14px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="28" style="padding-right:10px;font-size:18px;">🌿</td><td><p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#1B3A5C;">Non-GMO</p></td></tr></table></td></tr></table></td>
                <td style="width:50%;padding:0 0 0 6px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#EBF3FA;border-radius:10px;"><tr><td style="padding:12px 14px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="28" style="padding-right:10px;font-size:18px;">⚡</td><td><p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#1B3A5C;">Stimulant-free</p></td></tr></table></td></tr></table></td>
              </tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#EBF3FA;border-radius:12px;margin-bottom:16px;">
              <tr><td style="padding:14px 18px;">
                <p style="margin:0 0 3px;font-size:15px;font-weight:800;color:#1B3A5C;">🎢 {{ride_type}}</p>
                <p style="margin:0 0 8px;font-size:12px;color:#555;">{{ride_type_desc}}</p>
                <p style="margin:0;font-size:12px;color:#555;line-height:1.5;font-style:italic;">One of the five is traditionally called the "sugar destroyer" for how it dulls the taste for sweet.*</p>
              </td></tr>
            </table>
            <table class="benefit-row" role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="width:50%;padding:0 6px 8px 0;"><div style="background:#EBF3FA;border-radius:8px;padding:10px 14px;font-size:12px;font-weight:600;color:#1B3A5C;">📉 Calmer spikes</div></td>
                <td style="width:50%;padding:0 0 8px 6px;"><div style="background:#EBF3FA;border-radius:8px;padding:10px 14px;font-size:12px;font-weight:600;color:#1B3A5C;">🍫 Fewer cravings</div></td>
              </tr>
              <tr>
                <td style="width:50%;padding:0 6px 0 0;"><div style="background:#EBF3FA;border-radius:8px;padding:10px 14px;font-size:12px;font-weight:600;color:#1B3A5C;">⚡ Steadier energy</div></td>
                <td style="width:50%;padding:0 0 0 6px;"><div style="background:#EBF3FA;border-radius:8px;padding:10px 14px;font-size:12px;font-weight:600;color:#1B3A5C;">🔬 Your own GLP-1 &amp; appetite signals</div></td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:24px 28px;" align="center">
            <h2 style="margin:0 0 6px;font-size:18px;font-weight:900;color:#1B3A5C;text-align:center;">Genfito supports<br />your body's own GLP-1</h2>
            <p style="margin:0 0 16px;font-size:13px;color:#2980B9;text-align:center;font-weight:600;">Your natural fullness signal —<br />so feeling satisfied gets easier.*</p>
            <img src="https://genfito.com/images/04_GLUCOSE_ROLLERCOASTER.png" alt="GLP-1 body diagram" width="280" style="display:block;margin:0 auto;max-width:280px;width:100%;" />
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1B3A5C;border-radius:16px;overflow:hidden;">
          <tr><td align="center" style="padding:24px 32px;">
            <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#FFFFFF;text-align:center;">Try it with a 30-day money-back guarantee.</p>
            <p style="margin:0 0 16px;font-size:13px;color:#A8C4D8;text-align:center;line-height:1.5;">Most people start with the 6-month supply (Most Popular) — from about $1.55/day. Subscribe and save, cancel or skip anytime. Free US shipping + a 30-day money-back guarantee.</p>
            <a href="{{shop_url}}" style="display:inline-block;background:#C0392B;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:15px 36px;border-radius:8px;">START MY PLAN →</a>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:20px 24px 16px;" align="center">
            <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#1B3A5C;letter-spacing:1px;text-transform:uppercase;text-align:center;">CHOOSE YOUR PLAN</p>
            <table class="plan-cards-row" role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td class="plan-card" style="width:33%;padding:0 6px 0 0;vertical-align:top;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:2px solid #E0E0E0;border-radius:12px;overflow:hidden;"><tr><td style="padding:14px 12px;" align="center"><p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#888;letter-spacing:1px;text-transform:uppercase;">SAVE 5%</p><p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1B3A5C;">Monthly subscription</p><p style="margin:0 0 4px;font-size:10px;color:#888;">Best for balancing your savings</p><p style="margin:0 0 8px;font-size:22px;font-weight:900;color:#1B3A5C;">$53.10</p><p style="margin:0 0 4px;font-size:10px;color:#888;">$53.10 per bottle</p><p style="margin:0;font-size:10px;color:#888;">1 month supply</p></td></tr></table></td>
                <td class="plan-card" style="width:33%;padding:0 3px;vertical-align:top;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:2px solid #2980B9;border-radius:12px;overflow:hidden;"><tr><td style="background:#2980B9;padding:6px 12px;" align="center"><p style="margin:0;font-size:10px;font-weight:800;color:#FFFFFF;letter-spacing:1px;text-transform:uppercase;">MOST POPULAR</p></td></tr><tr><td style="padding:14px 12px;" align="center"><p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#2980B9;letter-spacing:1px;text-transform:uppercase;">SAVE 10%</p><p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1B3A5C;">6-month plan</p><p style="margin:0 0 4px;font-size:10px;color:#888;">For effective and optimal results</p><p style="margin:0 0 8px;font-size:22px;font-weight:900;color:#1B3A5C;">$283.20</p><p style="margin:0 0 4px;font-size:10px;color:#888;">$47.20 per bottle</p><p style="margin:0;font-size:10px;color:#888;">6 month supply</p></td></tr></table></td>
                <td class="plan-card" style="width:33%;padding:0 0 0 6px;vertical-align:top;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:2px solid #E0E0E0;border-radius:12px;overflow:hidden;"><tr><td style="padding:14px 12px;" align="center"><p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#888;letter-spacing:1px;text-transform:uppercase;">SAVE 15%</p><p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1B3A5C;">Yearly plan</p><p style="margin:0 0 4px;font-size:10px;color:#888;">For long-lasting results</p><p style="margin:0 0 8px;font-size:22px;font-weight:900;color:#1B3A5C;">$531.00</p><p style="margin:0 0 4px;font-size:10px;color:#888;">$44.25 per bottle</p><p style="margin:0;font-size:10px;color:#888;">12 month supply</p></td></tr></table></td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td class="faq-section" style="padding:24px 28px;">
            <h3 style="margin:0 0 20px;font-size:16px;font-weight:800;color:#1B3A5C;text-align:center;">FAQ</h3>
            <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1B3A5C;">Is Genfito Safe for Pregnant or Breastfeeding Women?</p>
            <p style="margin:0 0 16px;font-size:12px;color:#555;line-height:1.6;">We recommend consulting your healthcare provider before starting any new supplement during pregnancy or breastfeeding. Genfito is formulated for healthy adults and has not been specifically tested in pregnant or nursing women.</p>
            <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1B3A5C;">How Fast Can I Expect to See Noticeable Results?</p>
            <p style="margin:0 0 16px;font-size:12px;color:#555;line-height:1.6;">Most customers notice a difference in their afternoon energy and cravings within the first 2–3 weeks. The full effect on blood sugar patterns typically builds over 4–6 weeks of consistent use.</p>
            <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1B3A5C;">Can I cancel or get a refund?</p>
            <p style="margin:0;font-size:12px;color:#555;line-height:1.6;">Yes. Every subscription can be cancelled or skipped anytime — no questions asked. If you're not satisfied within 30 days, we'll refund your first order in full.</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1B3A5C;border-radius:16px;overflow:hidden;">
          <tr><td align="center" style="padding:28px 32px;">
            <p style="margin:0 0 6px;font-size:17px;font-weight:800;color:#FFFFFF;text-align:center;">Your rollercoaster score isn't a verdict.<br />It's a starting point.</p>
            <p style="margin:0 0 20px;font-size:13px;color:#A8C4D8;text-align:center;">The pattern can be calmed. The cravings can quiet down.</p>
            <a href="{{shop_url}}" style="display:inline-block;background:#C0392B;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:15px 36px;border-radius:8px;">START MY PLAN →</a>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:8px 0 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:20px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="48" valign="top" style="padding-right:16px;">
                  <img src="https://genfito.com/images/logo_icon.png" alt="GENFITO" width="36" height="36" style="display:block;" />
                  <p style="margin:4px 0 0;font-size:9px;font-weight:700;letter-spacing:1.5px;color:#1B3A5C;">GENFITO</p>
                </td>
                <td valign="top">
                  <p style="margin:0 0 6px;font-size:11px;color:#999999;line-height:1.5;">If you no longer wish to receive emails from GENFITO, <a href="{{unsubscribe_url}}" style="color:#2980B9;">click here</a> to Unsubscribe from our mailing list.</p>
                  <p style="margin:0;font-size:10px;color:#BBBBBB;line-height:1.5;">Disclaimer: Content and statements on this website have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. It should not be substituted for medical advice or medical intervention. Please consult a qualified healthcare provider when making medical decisions. Exercise and a healthy diet are necessary to achieve and maintain weight loss.</p>
                  <p style="margin:8px 0 0;font-size:10px;color:#BBBBBB;">© 2026 Genfito. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`, vars);
}

// ─── EMAIL 3: Social Proof (+48h) ──────────────────────────────────────────────
function buildEmail3(vars) {
  return fillTemplate(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Around week three, the cravings quieted down.</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-wrapper { width: 100% !important; }
      .before-after-img { width: 100% !important; height: auto !important; }
      .cta-button { font-size: 15px !important; padding: 14px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#EBF3FA;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Most people don't feel everything on day one. Around week three, something shifts.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EBF3FA;">
  <tr><td align="center" style="padding:24px 16px;">
    <table class="email-wrapper" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="padding:20px 0 16px;">
        <img src="https://genfito.com/images/logo_icon.png" alt="GENFITO" width="48" height="48" style="display:block;margin:0 auto 6px;" />
        <div style="font-size:13px;font-weight:700;letter-spacing:2px;color:#1B3A5C;">GENFITO</div>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:24px 28px 20px;" align="center">
            <h1 style="margin:0 0 20px;font-size:22px;font-weight:900;color:#1B3A5C;line-height:1.3;text-align:center;font-style:italic;">"Around week three, the<br />cravings quieted down."</h1>
          </td></tr>
          <tr><td style="padding:0 28px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F0F0F0;border-radius:12px;overflow:hidden;margin-bottom:14px;">
              <tr><td><img class="before-after-img" src="https://genfito.com/images/testimonial_sharon.png" alt="Sharon before and after using Genfito" width="544" style="display:block;width:100%;border-radius:12px;" /></td></tr>
              <tr><td style="padding:12px 16px;background:#1B3A5C;border-radius:0 0 12px 12px;">
                <p style="margin:0 0 4px;font-size:12px;color:#FFFFFF;font-style:italic;line-height:1.5;">"Down 12 lbs — and the biggest change was feeling in control again. My cravings are milder, my afternoons feel easier, and I finally feel calm after eating."</p>
                <p style="margin:0;font-size:11px;color:#A8C4D8;">— Sharon Mitchell</p>
              </td></tr>
            </table>
            <div style="text-align:center;margin-bottom:16px;"><span style="display:inline-block;background:#EBF3FA;border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;color:#2980B9;">✓ Verified Customer</span></div>
            <p style="margin:0;font-size:13px;color:#555;line-height:1.7;text-align:center;">Most people don't feel everything on day one — and that's normal. The pattern customers describe is a bit like the first few days, the afternoon crash softens and energy steadies; over the first few weeks, the cravings quiet down and eating gets easier to control. Consistency is what gets them there.</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:24px 28px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#2980B9;letter-spacing:1.5px;text-transform:uppercase;text-align:center;">WHY THE CRAVINGS KEEP</p>
            <h2 style="margin:0 0 20px;font-size:20px;font-weight:900;color:#1B3A5C;text-align:center;line-height:1.3;">Same meal.<br />Two very different afternoons.</h2>
            <img src="https://genfito.com/images/glucose_curves.png" alt="Glucose response comparison: without support vs with Genfito" width="520" style="display:block;width:100%;max-width:520px;margin:0 auto 16px;border-radius:8px;" />
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="width:50%;padding:0 8px 0 0;vertical-align:top;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FDECEA;border-radius:10px;"><tr><td style="padding:12px 14px;"><p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#C0392B;text-transform:uppercase;letter-spacing:0.5px;">Without Support</p><p style="margin:0;font-size:12px;color:#555;line-height:1.5;">A fast spike drops blood sugar hard, and about two hours later the crash shows up as cravings and an energy dip.</p></td></tr></table></td>
                <td style="width:50%;padding:0 0 0 8px;vertical-align:top;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#EBF3FA;border-radius:10px;"><tr><td style="padding:12px 14px;"><p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#2980B9;text-transform:uppercase;letter-spacing:0.5px;">With Genfito</p><p style="margin:0;font-size:12px;color:#555;line-height:1.5;">The steadier response Genfito is designed to support — the rise is gentler, the drop is softer, and the "find sugar now" signal never gets loud.</p></td></tr></table></td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1B3A5C;border-radius:16px;overflow:hidden;">
          <tr><td align="center" style="padding:28px 32px;">
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#FFFFFF;text-align:center;line-height:1.3;">The only way<br />to know is to feel it.</h2>
            <p style="margin:0 0 20px;font-size:13px;color:#A8C4D8;text-align:center;line-height:1.6;">Every plan comes with a 30-day money-back guarantee. Give it a real shot. If the cravings and crashes don't settle, get your money back — no questions. Cancel or skip anytime.</p>
            <a href="{{shop_url}}" class="cta-button" style="display:inline-block;background:#C0392B;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:15px 36px;border-radius:8px;">START WITH GENFITO →</a>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:24px 32px;" align="center">
            <p style="margin:0 0 6px;font-size:18px;font-weight:900;color:#1B3A5C;text-align:center;line-height:1.3;">You're <strong style="color:#2980B9;">{{goal_gap}} lbs</strong> from <strong style="color:#2980B9;">{{goal_weight}}</strong>.</p>
            <p style="margin:0;font-size:14px;color:#555;text-align:center;line-height:1.6;">Calming the spikes is where it gets easier.<br /><span style="color:#2980B9;font-weight:600;">Whenever you're ready.</span></p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:8px 0 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:20px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="48" valign="top" style="padding-right:16px;">
                  <img src="https://genfito.com/images/logo_icon.png" alt="GENFITO" width="36" height="36" style="display:block;" />
                  <p style="margin:4px 0 0;font-size:9px;font-weight:700;letter-spacing:1.5px;color:#1B3A5C;">GENFITO</p>
                </td>
                <td valign="top">
                  <p style="margin:0 0 6px;font-size:11px;color:#999999;line-height:1.5;">If you no longer wish to receive emails from GENFITO, <a href="{{unsubscribe_url}}" style="color:#2980B9;">click here</a> to Unsubscribe from our mailing list.</p>
                  <p style="margin:0;font-size:10px;color:#BBBBBB;line-height:1.5;">Disclaimer: Content and statements on this website have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. It should not be substituted for medical advice or medical intervention. Please consult a qualified healthcare provider when making medical decisions. Exercise and a healthy diet are necessary to achieve and maintain weight loss.</p>
                  <p style="margin:8px 0 0;font-size:10px;color:#BBBBBB;">© 2026 Genfito. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`, vars);
}

// ─── Send a single email via Resend ───────────────────────────────────────────
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

// ─── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
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
    cta_url = 'https://genfito.com/quiz.html',
    shop_url = 'https://genfito.com/#offer',
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
    shop_url,
    unsubscribe_url: `https://genfito.com/unsubscribe?email=${encodeURIComponent(email)}`,
    gauge_url: getGaugeUrl(parseInt(rollercoaster_score)),
    base_url: BASE_URL,
  };

  const results = { email1: null, email2: null, email3: null, errors: [] };

  // Email 1: Send immediately
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

  // Email 2: Schedule for 24h later
  try {
    const html2 = buildEmail2(vars);
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

  // Email 3: Schedule for 48h later
  try {
    const html3 = buildEmail3(vars);
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
