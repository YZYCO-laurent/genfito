# Genfito Quiz Mobile Audit Notes

Source screenshots: `/tmp/mobile_01_opening.png` to `/tmp/mobile_13_r4_bottom.png`
Viewport used: **390 x 844** (iPhone 14)
Date: 2026-07-20

## Screen-by-Screen Findings

| Screen | Status | Issues |
|---|---|---|
| Opening | GOOD | Fits well. Headline, doctor quote, CTA all correct. |
| Q1 questions | BLANK | Script didn't activate correctly — need to verify via browser. Likely fine based on CSS. |
| Good news | BROKEN | Side-by-side layout too narrow. Text column is ~200px wide — extremely cramped. Needs `flex-direction: column` on mobile. |
| Loading | FADED | Content appears very faint/washed out. Likely a contrast/opacity issue on mobile. |
| Email gate | MOSTLY OK | Layout fits but button appears washed out (probably opacity animation state). |
| R1 Ride Type | MOSTLY OK | Layout stacks correctly. BUT: (1) All text/colors are very faded/washed out — low contrast. (2) Gauge is partially cut off at bottom. (3) Answer chips grid is 2-col which is fine. (4) CTA button is faded. |
| R2 Chart | TBD | Need to view |
| R3 Cycle | TBD | Need to view |
| GLP-1 | TBD | Need to view |
| Social Proof | TBD | Need to view |
| Final CTA top | TBD | Need to view |
| Final CTA bottom | TBD | Need to view |

## KEY ISSUE: All result screens appear washed out / faded
- This is likely because `buildResults()` was called but the screen animation/entrance opacity hasn't triggered
- The quiz uses CSS transitions/opacity for screen entrance animations
- On mobile, these screens may not be getting the `active` class applied with the right opacity

## Confirmed Mobile Fixes Needed

### Layout fixes
1. **Good news screen**: Stack the 2-column layout vertically on mobile
2. **R1 screen**: Gauge may be cut off — check if it needs smaller canvas on mobile
3. **Final CTA plan cards**: Need to verify single-column stacking on mobile

### CSS/Visual fixes
4. **Logo area**: Shows both the icon AND the text "GENFITO GENFITO" (doubled) — the `<span>` text label below the icon is redundant on mobile
5. **Screen opacity/contrast**: All result screens appear faded — check if `.screen.active` opacity is correct on mobile
6. **Loading screen**: Content too faint — check loading animation CSS on mobile

### Spacing fixes  
7. **Card padding**: Reduce from desktop values on mobile
8. **Trust icons row**: May need to wrap to 2x2 grid on mobile
9. **Plan cards**: Verify they stack to single column on mobile


## Additional Findings from Result Screens

| Screen | Status | Issues |
|---|---|---|
| R2 Chart | Mostly okay, needs spacing review | Overall structure appears to fit mobile, but the same washed-out appearance persists. Need to confirm chart scales properly and labels remain readable. |
| R3 Cycle | Likely needs mobile simplification | Dense infographic-style content appears compressed vertically. Need tighter spacing and possibly smaller icon/text sizing. |
| GLP-1 | Major issue | The diagram is still too large/tall for mobile and sits far below the explanatory copy/CTA. The screen feels unbalanced. Likely should reorder or reduce image height on mobile. Also overall faded appearance persists. |
| Social Proof | Major issue | Desktop-style content is not adapted well. Before/after image is okay width-wise, but testimonial cards are extremely tall with too much empty space and low contrast. Needs smaller padding, stronger text contrast, and better card height management. |
| Final CTA (top) | Needs work | Main structure stacks correctly, but mobile layout is still too airy/tall. Plan cards are very tall. Tabs fit, but plan content needs tighter spacing and likely smaller paddings. Text and buttons still appear visually faint in the screenshots. |

## Global Mobile Problems Confirmed

1. **Duplicate logo text**: logo icon plus wordmark text appears duplicated as `GENFITO` and again below it on multiple screens.
2. **Too much vertical whitespace** on results and CTA screens.
3. **Desktop cards remain too tall on mobile**, especially social proof and final CTA.
4. **Diagram/image blocks are oversized** on GLP-1 and likely other result screens.
5. **Potential opacity/entrance-state issue** still makes many screens look pale in screenshots; needs CSS inspection.

## Most likely CSS targets
- Mobile media queries for `.result-card`, `.quiz-card`, `.r4-plan-card`, `.social-*`, `.glp1-*`, `.good-news-*`, `.logo*`
- Any `opacity`, `transform`, or `animation` styles tied to inactive/active screens
- Mobile-specific padding and gap rules
- Result chart/gauge canvas sizing on mobile
