# Genfito Quiz Result Cards - Figma Design Notes

## Figma File
- Key: [redacted - stored in project memory]
- File: jH3d0UsTmsNc3PEALsWwuY
- URL: https://www.figma.com/design/jH3d0UsTmsNc3PEALsWwuY/GENFITO--Copy-

## R1 Card (node 0:465) - "Yes — you're on the blood sugar rollercoaster"
- Two-column layout: left = ride type + chips + insight + CTA, right = gauge
- Ride type tile: PNG icon (64px) + name (bold blue) + desc
- Answer chips: 2x2 grid, each chip has small PNG icon + text
- Insight tile: heart+EKG PNG icon + "It's not willpower." bold + body text
- Score gauge: colored arc (green→yellow→orange→red), needle, center dot+white dot
- Score number: 72pt bold dark blue
- Zone badge: full-width red pill "YOU'RE IN THE 'WILD RIDE' ZONE"
- ROLLERCOASTER SCORE label: dark blue (not gray)

## R1b Card (node 0:534) - "Here's where you're starting"
- Two-column top: left = "YOUR BMI" label + big number + range text, right = BMI bar
- BMI bar: horizontal colored bar (green/yellow/orange/red)
  - Category labels ABOVE bar: "Healthy" (green), "Overweight" (orange), "Higher" (red)
  - Marker: circle dot ON bar + vertical line DOWN + dark blue pill showing BMI value
  - Tick marks + numbers BELOW bar: 18.5, 25, 30, 40
- Insight tile: BMI speedometer icon (circle with gauge) + bold text + body
- Disclaimer centered below
- Full-width red CTA "SEE YOUR PLAN →"

## Icons Downloaded (in /images/icons/)
- ride_sugar_craver.png - rollercoaster illustration
- ride_afternoon_crasher.png - lightning bolt / energy
- ride_stuck_metabolism.png - scale
- ride_menopause_shift.png - flower/hormone
- insight_heart.png - heart with EKG line
- bmi_speedometer.png - speedometer with "BMI" text in circle
- tag_cupcake.png - sugar cravings
- tag_scale.png - weight
- tag_snack.png - snacking
- tag_moon.png - late night
- tag_brain.png - brain fog / afternoon crash
- tag_energy.png - energy dips
- tag_lightning.png - energy
- tag_active.png - active but stuck
- tag_tried_everything.png - tried everything
- tag_wont_move.png - scale won't move
- tag_peri.png - perimenopause
- tag_hormonal.png - hormonal shift
- tag_menopause.png - menopause
- tag_weight_changed.png - weight changed

## BMI Bar Math
- Bar spans BMI 18.5 to 40 (total 21.5 units)
- Healthy: 18.5-25 (30.2% of bar width)
- Overweight: 25-30 (23.3%)
- Higher: 30-40 (46.5%)
- Marker position: ((bmi - 18.5) / 21.5) * 100%
