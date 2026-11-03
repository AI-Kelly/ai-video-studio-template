# AI Video Studio: instructions for Claude

The user records short talking-head videos and needs branded animations timed to their voiceover. This project renders them with Remotion (videos made from code). Write to the user in plain, brief English. Assume they are not technical.

## Setup (automatic)

The user works in Claude Code in the browser, so Claude runs every command; never ask the user to use a terminal.
Each session starts fresh. `.claude/settings.json` runs `scripts/setup.sh` at session start, which installs the npm packages and the transcription tool. If a command fails because something is missing, run `./scripts/setup.sh --force` and retry. `remotion.config.ts` finds the cloud's built-in Chromium on its own, and fonts are bundled in `public/fonts`, so renders need no internet.

The user can't open the live preview from the browser. Send them rendered MP4s (and still frames when checking a detail) and take their changes in plain English.

## First run: "set up my brand"

If `BRAND.name` in `src/brand.ts` is still `'Your Company'`, offer this before the first video. The default look is a neutral placeholder, so don't make real videos in it without saying so.

1. Ask for: company name, and their brand colors (hex codes, a style guide, a logo, or their website so you can pick colors from it). Ask which fonts they use, if any.
2. Map their colors onto the roles in `BRAND.colors` (`paper` light background, `primary` dark/headline color, `accent` the ONE highlight color, and so on; each role has a comment). Keep `paper` off pure white, and make sure text stays readable: `primary` and `ink` must be dark enough on `paper`, `paper` must read on `primary`, and `onAccent` must read on `accent`.
3. Fonts: for a Google Font, get the .woff2 files with `npm pack @fontsource/<font-name>` (unpack, use `files/<font>-latin-<weight>-normal.woff2`), copy them to `public/fonts`, and update `BRAND.fonts`. Include the font's license file and remove fonts no longer used. If their font isn't free to bundle, pick the closest Google Font and say so.
4. **Style rules.** Walk through `STYLE.md` with them in plain English, a few rules at a time: keep, change, or drop each one, and ask if they have rules of their own (words to avoid, tone, things their brand never does). Update `STYLE.md` with their answers and change its status line to "reviewed with the user".
5. Render the demo (`npm run render -- demo`) and send it so they can see their brand on every scene. Adjust until they're happy, then commit and push.

They can say "change my style rules" any time to repeat step 4.

## Workflow when the user says "animate this video" (or gives a script + audio)

1. **Get the inputs.** Finished script, voiceover file, and any screenshots. If there are no screenshots, list the 2-4 spots in the script where one would help most and ask once; if they say no, build with text scenes. For a public web page, you can take the screenshot yourself with Playwright. Never invent numbers or results.
2. **Pick an id**, short and dashed (e.g. `pricing-tips`). Copy the audio to `public/videos/<id>/voiceover.<ext>` and screenshots next to it.
3. **Transcribe:** `python3 scripts/transcribe.py public/videos/<id>/voiceover.<ext>`. Read `transcript.txt`. Use what the user ACTUALLY said, not the script: if wording differs, match on-screen text to the recording and tell them what changed.
4. **Write the cue sheet** `src/videos/<id>.json` (see `src/types.ts` and `src/videos/demo.json`) and add it to `src/videos/index.ts`.
   - All times are seconds from the start of the audio, taken from `words.json`.
   - Scene `start`: about 0.2s before the first word of that beat.
   - Item `at`: the start time of the word that names it (a highlight on "Seven people" uses the time of "Seven").
   - `duration`: the audio length printed by the transcribe script.
   - Follow `STYLE.md` for headlines and on-screen text.
5. **Check it:** `npx tsc --noEmit`, then render stills at key moments (`npx remotion still src/index.ts <id> out/check.png --frame=<n>`) and look at them. Fix overlaps, overflow, or highlight boxes in the wrong place.
6. **Render and send:** `npm run render -- <id>` (add `full` for 16:9). Output is `out/<id>.mp4` with the voiceover included. Send it to the user.
7. **Report:** one line per scene with its time and what shows, plus at most 2-3 flags. Commit and push the cue sheet and assets when they're happy.

## Highlight boxes on screenshots

Values are percentages of the image: `top = row top px / image height * 100`, same for `height`, `left`, `right`. Box only the 1-2 things the voiceover talks about.

## Style rules

Follow `STYLE.md` on every video. It holds the user's own rules for the look and the on-screen writing.

Technical rules that always apply: all colors and fonts come from `src/brand.ts`; never hard-code a color in a scene (use `C.<role>` or `alpha(C.<role>, 0.2)`), and use the easing in `src/motion.ts`.

## Adding a new scene type

Add the type to `SceneSpec` in `src/types.ts`, build the component in `src/scenes/index.tsx` using `SceneFrame`, `Eyebrow`, `Headline`, `reveal()` and `local()`, add it to `renderScene`, and add a row to the README's scene table. Size everything in `em` so it works in both `half` and `full`.
