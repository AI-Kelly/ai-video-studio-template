# AI Video Studio: instructions for Claude

The user records short talking-head videos and needs branded animations timed to their voiceover. This project renders them with Remotion (videos made from code). Write to the user in plain, brief English. Assume they are not technical.

## Setup (automatic)

The user works in Claude Code in the browser, so Claude runs every command; never ask the user to use a terminal.
Each session starts fresh. `.claude/settings.json` runs `scripts/setup.sh` at session start, which installs the npm packages and the transcription tool. If a command fails because something is missing, run `./scripts/setup.sh --force` and retry. `remotion.config.ts` finds the cloud's built-in Chromium on its own, and fonts are bundled in `public/fonts`, so renders need no internet.

The user can't open the live preview from the browser. Send them rendered MP4s (and still frames when checking a detail) and take their changes in plain English.

## First run: "set up my brand"

If `BRAND.name` in `src/brand.ts` is still `'Your Company'`, offer this before the first video.

1. Ask for: company name, and their brand colors (hex codes, a style guide, a logo, or their website so you can pick colors from it). Ask which fonts they use, if any.
2. Map their colors onto the roles in `BRAND.colors` (`paper` light background, `primary` dark/headline color, `accent` the ONE highlight color, and so on; each role has a comment). Keep `paper` off pure white, and make sure text stays readable: `primary` and `ink` must be dark enough on `paper`, and `paper` must read on `primary`.
3. Fonts: for a Google Font, get the .woff2 files with `npm pack @fontsource/<font-name>` (unpack, use `files/<font>-latin-<weight>-normal.woff2`), copy them to `public/fonts`, and update `BRAND.fonts`. Include the font's license file. If their font isn't free to bundle, pick the closest Google Font and say so.
4. Render the demo (`npm run render -- demo`) and send it so they can see their brand on every scene. Adjust until they're happy, then commit and push.

## Workflow when the user says "animate this video" (or gives a script + audio)

1. **Get the inputs.** Finished script, voiceover file, and any screenshots. If there are no screenshots, list the 2-4 spots in the script where one would help most and ask once; if they say no, build with text scenes. For a public web page, you can take the screenshot yourself with Playwright. Never invent numbers or results.
2. **Pick an id**, short and dashed (e.g. `pricing-tips`). Copy the audio to `public/videos/<id>/voiceover.<ext>` and screenshots next to it.
3. **Transcribe:** `python3 scripts/transcribe.py public/videos/<id>/voiceover.<ext>`. Read `transcript.txt`. Use what the user ACTUALLY said, not the script: if wording differs, match on-screen text to the recording and tell them what changed.
4. **Write the cue sheet** `src/videos/<id>.json` (see `src/types.ts` and `src/videos/demo.json`) and add it to `src/videos/index.ts`.
   - All times are seconds from the start of the audio, taken from `words.json`.
   - Scene `start`: about 0.2s before the first word of that beat.
   - Item `at`: the start time of the word that names it (a highlight on "Seven people" uses the time of "Seven").
   - `duration`: the audio length printed by the transcribe script.
   - One headline + one visual per scene, headlines 3-8 words, one `*accent*` payoff per headline.
5. **Check it:** `npx tsc --noEmit`, then render stills at key moments (`npx remotion still src/index.ts <id> out/check.png --frame=<n>`) and look at them. Fix overlaps, overflow, or highlight boxes in the wrong place.
6. **Render and send:** `npm run render -- <id>` (add `full` for 16:9). Output is `out/<id>.mp4` with the voiceover included. Send it to the user.
7. **Report:** one line per scene with its time and what shows, plus at most 2-3 flags. Commit and push the cue sheet and assets when they're happy.

## Highlight boxes on screenshots

Values are percentages of the image: `top = row top px / image height * 100`, same for `height`, `left`, `right`. Box only the 1-2 things the voiceover talks about.

## Style rules

- All colors and fonts come from `src/brand.ts`; never hard-code a color in a scene (use `C.<role>` or `alpha(C.<role>, 0.2)`). The `accent` color is the only highlight: payoff words, highlight boxes, check badges, the one button.
- Headlines in sentence case: a plain statement, then one accent italic payoff.
- Background rhythm: dark for the hook and quote, surface every second or third scene, ink for the closer.
- Smooth easing only (`src/motion.ts`), no bounce, no looping motion. No emoji, no exclamation marks, no stock AI imagery.
- Writing: no em dashes, no dramatic fragment sequences ("Not X. Not Y. Z."), plain words.

## Adding a new scene type

Add the type to `SceneSpec` in `src/types.ts`, build the component in `src/scenes/index.tsx` using `SceneFrame`, `Eyebrow`, `Headline`, `reveal()` and `local()`, add it to `renderScene`, and add a row to the README's scene table. Size everything in `em` so it works in both `half` and `full`.
