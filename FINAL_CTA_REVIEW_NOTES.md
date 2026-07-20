# Social Proof and Final CTA Review Notes

## Social Proof card
Source references:
- Live page: https://shop.genfito.com/quiz (screen-social-proof)
- Figma export: /home/ubuntu/genfito-git/images/figma_refs/social_proof.png

Findings:
- The Social Proof card is already very close to the Figma reference.
- The title, star rating, user count, testimonial imagery, quotes, and overall three-card layout match well.
- No major rebuild appears necessary for Social Proof.

## Final CTA card
Source references:
- Live page: https://shop.genfito.com/quiz (screen-r4)
- Figma export: /home/ubuntu/genfito-git/images/figma_refs/final_cta.png

Live-state findings:
- Headline currently renders as "Your The Sugar-Craver plan to reach 165 lbs." when goal data exists.
- If goal data is missing, fallback headline becomes "Your The Sugar-Craver plan is ready."
- This happens because RESULT_TYPES names include a leading "The", while the headline template also prepends "Your ".
- Subscribe tab is active by default, which matches Figma, but the tab label text/layout should match Figma more closely.
- Current subscribe offers do not match Figma pricing, quantities, labels, or descriptions.
- Current one-time offers do not match Figma quantities and should likely render only two cards, not three.
- Current plan card layout is too vertical; Figma shows more compact horizontal content blocks with the bottle image on the left and text on the right.
- Middle subscribe card should be the emphasized "MOST POPULAR" option.
- Current guarantee / support copy differs from Figma.
- Trust row and secure row are close conceptually but should be tightened to better match spacing and wording from Figma.

## Figma-specific target state for Final CTA
### Headline
- Should read like: "Your Sugar-Craver plan to reach [goal weight.]"
- Remove the leading article from the ride type label in this headline only.

### Body copy
- Current copy is too generic.
- Figma body copy includes the idea of personalizing the supply length to the goal.

### Tabs
- Left tab: ONE-TIME PURCHASE
- Right tab: SUBSCRIBE
- Subscribe is the active/red state in the Figma reference.

### Subscribe tab plans
1. Monthly subscription
   - Save 10%
   - $53.10
   - $53.10 per bottle
   - 1 bottle will be delivered every month
2. 6-month plan
   - Save 20%
   - MOST POPULAR
   - $283.20
   - $47.20 per bottle
   - 6 bottles will be delivered in total
3. Yearly plan
   - Save 25%
   - $531.00
   - $44.25 per bottle
   - 12 bottles will be delivered in total

### One-time tab plans
1. One-time purchase
   - Try Genfito risk-free
   - $59.00
   - $53.10 per bottle (as shown in Figma small text)
   - 1 bottle will be delivered
2. One-time purchase great for building new habits
   - Save 30%
   - $41.33 per bottle
   - 3 bottles will be delivered

### Visual/layout cues
- Figma uses a compact, premium offer-card layout.
- Selected middle subscription card is highlighted with a pale blue background and stronger border.
- Badge ribbon for MOST POPULAR is angled in the top-right area of the center card.
- Cards are horizontally structured, not simple stacked vertical product tiles.
- Main CTA is a centered red button: START WITH GENFITO.

## Candidate bottle asset
- /home/ubuntu/genfito-git/images/bottle_hero.png appears to be the best current bottle asset for Final CTA cards.
- /home/ubuntu/genfito-git/images/hero_bottle_figma.png is also high quality and can be used if needed for tighter Figma similarity.

## Implementation direction
- Rebuild the Final CTA plan-card renderer and its plan data.
- Add support for different card counts per tab (3 subscribe cards, 2 one-time cards).
- Update headline logic to strip a leading "The " from RESULT_TYPES[rideType].name when rendering this screen.
- Tighten CSS to match Figma spacing, card emphasis, and horizontal card composition.
- Keep current Shopify checkout URLs unless the user requests product-link changes.

## Current live test caveat
- The quick browser test used `buildResults()` and manual screen jumps, but did not populate `answers.q15` automatically.
- After manually setting `answers.q15 = { goal: 165 }`, the headline correctly switched from "plan is ready" to the goal-based version.
- Therefore, the live goal-weight headline logic is structurally working, but the wording still needs the leading-article fix.

