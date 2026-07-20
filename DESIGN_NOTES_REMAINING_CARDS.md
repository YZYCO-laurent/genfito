# Remaining Figma Card Findings for Quiz Sequence

## Required post-email card sequence
1. R1 dynamic ride type card
2. R1b BMI card
3. R2 two-paths chart card
4. R3 what-it-means card
5. Doctor advice interstitial
6. R4 solution/product card
7. R5 simple-by-design card
8. GLP-1 card
9. Social proof card
10. Final CTA personalized offer card

## R2 note
- User says the graph image should be used because current graph does not load or should be replaced.
- Exported graph image likely already includes legend and graph, so if used, do not duplicate legend outside it.

## R3 What being a Sugar-Craver means
Source: images/figma_refs/r3_what_it_means.png
- Headline: "What being a Sugar-Craver means."
- Intro paragraph explains spike-crash pattern and insulin crash cycle.
- Section label: "BASED ON YOUR ANSWERS"
- Three light-blue pill tags with small icons:
  - The Sugar-Craver
  - Cravings after meals
  - Weight crept up
- Middle row: 5 bordered cards connected by arrows
  1. Carbs / Sugar — You eat carbs or sugary food
  2. Glucose Spike — Blood sugar rises quickly
  3. insulin Surge — Insulin rushes in to lower it fast
  4. Crash — Blood sugar level drops too low
  5. Hunger, cravings, low energy — You feel drained, crave more, and your body stores fat
- Bottom insight tile with heart/EKG icon:
  - Bold: "This isn't about willpower - it's a pattern you can calm"
  - Body: "The good news: with the right plan, you can break the cycle and feel steady, satisfied, and in control."
- CTA button: CONTINUE →

## Doctor interstitial
Source: images/figma_refs/doctor_interstitial.png
- Very minimal interstitial.
- Appears to be a light blue full-page screen with logo and progress dots.
- Large centered beige/gray circle in middle; likely video/avatar/doctor placeholder or transition element.
- Very faint/white CONTINUE → near bottom center.
- Need deeper node/text inspection because exported frame appears mostly blank.

## R4 Solution card
Source: images/figma_refs/r4_solution.png
- Two-column card.
- Left headline: "Meet Genfito Glucose Metabolism Support - built for your type."
- Body: "Five studied ingredients selected to support a healthier post-meal glucose response and calm he cycle that drives cravings and crashes."
- Four feature pills in 2x2 grid with icons:
  - 3rd-Party Lab Tested
  - Made in USA
  - Non-GMO
  - Stimulant-free
- Right side: large product bottle image inside pale blue panel.
- CTA button bottom-left: CONTINUE →

## R5 Simple by design
Source: images/figma_refs/r5_simple.png
- Headline: "Simple by design."
- Top row has 3 columns with circular blue-tinted icons and text:
  1. "1. Take 2 capsules before your biggest meal of the day."
  2. "2. Support a calmer response - the ingredients go to work on your post-meal glucose."
  3. "3. Feel the difference - fewer cravings, steadier energy, easier consistency over time."
- Divider line below top row.
- Bottom row timeline with 3 milestone icons connected by horizontal line:
  - First few days: steadier energy and a smaller post-meal crash.
  - First few weeks: fewer cravings and easier consistency, meal to meal.
  - Over 2-3 months: ongoing support for your body's own glucose response and GLP-1 and appetite signals.
- CTA button centered at bottom: CONTINUE →

## GLP-1 card
Source: images/figma_refs/glp1_card.png
- Two-column card.
- Left headline: "Support your body's own GLP-1 - naturally."
- Body copy explains GLP-1 as body’s natural fullness signal and says Genfito supports glucose response and appetite signals.
- Light blue badge/tile with icon and text: "A natural place to start."
- CTA button: CONTINUE →
- Right panel illustration: human torso/stomach graphic on pale blue background.
- Three white circular callouts on right side:
  - GLP-1 / Fullness signal
  - Appetite support
  - Glucose response support
- Dotted connector lines from stomach area to each callout.

## Remaining cards still need visual review
- Social proof card image downloaded: images/figma_refs/social_proof.png
- Final CTA personalized offer image downloaded: images/figma_refs/final_cta.png
- Need separate visual inspection + possible deeper node inspection before implementation.

## Asset notes
- goal_target.png already downloaded for R2.
- Additional card assets may be extractable directly from Figma if not already present in current project.
- Need to inspect current quiz.html for existing extra cards and current navigation order before rewriting.

## Implementation priority
1. Inspect social proof and final CTA visuals.
2. Inspect current HTML screen sequence and IDs.
3. Decide where to replace canvas-based R2 with static graph image.
4. Add missing doctor interstitial and missing cards.
5. Rewire button flow to exact sequence above.
6. Remove obsolete/non-Figma result cards.
