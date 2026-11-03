# AI Video Studio

Turn a voiceover into a branded, animated video. You record your voice, and Claude builds the slides, times every item to the word you say it, and sends back an MP4.

Made for members of the [AI Marketing Automation Lab](https://ai-marketinglabs.com).

## Before you start: the Remotion license

This project uses [Remotion](https://www.remotion.dev) to make the videos. Remotion is free for individuals and for companies with 3 or fewer people. Larger companies need a paid Remotion company license. Check [remotion.dev/license](https://www.remotion.dev/license) for the current terms before you use this at work.

## Set it up (about 10 minutes, once)

1. **Make your own copy.** At the top of this page, click **Use this template**, then **Create a new repository**. Give it a name and set it to **Private**.
2. **Connect GitHub to Claude.** In Claude, go to Customize, then Connectors, then GitHub, and connect your account if you haven't already.
3. **Give Claude access to your new repo.** On GitHub, go to Settings, then Applications, then Installed GitHub Apps, then Claude, then **Configure**. Under Repository access, add your new repo (or pick "All repositories") and save.
4. **Start a session.** Open Claude Code in the browser, start a new session, and pick your new repo.
5. **Say "set up my brand."** Claude asks for your company name, colors, and fonts, swaps them in, and sends you a demo video in your brand.

## Make a video

In a Claude Code session on your repo, attach your voiceover recording, paste your script, add any screenshots, and say **"animate this video."**

Claude transcribes your audio, writes a cue sheet (which scene shows, and on which word each item comes in), renders the video, and sends it to you. Ask for changes in plain English, like "bring the second step in a bit later."

Each session sets itself up automatically, which takes about 20 seconds.

## Sizes

- **half** (1080 x 1296): fills the left half of a 16:9 frame, with you on camera on the right. This is the default.
- **full** (1920 x 1080): full-screen animation. Ask Claude for "the full-size version."

## Scenes

| Scene | What it shows |
|---|---|
| `hook` | Dark opener, color blocks drop in, big headline |
| `statement` | Headline and a sub line on any background |
| `inbox` | An ignored email: folder, tag, wall of text, badge |
| `steps` | 2 to 4 step vertical flow, last step highlighted |
| `screenshot` | A real screenshot with highlight boxes |
| `stat` | A big number that counts up, with a label |
| `quote` | The line you want remembered, on a dark background |
| `cta` | Closing scene with check items, a button, and a footer line |

Need something new? Ask Claude to add a scene. It stays in your copy for every future video.

## Optional: live preview on a Mac

The browser version sends you finished videos. If you'd like to scrub through a video while it's being edited, you can run it on a Mac: install [Homebrew](https://brew.sh), then run `brew install node ffmpeg`, `pip3 install faster-whisper`, clone your repo, run `npm install`, and `npm run studio`.

## What's in here

- `src/brand.ts`: your colors and fonts (the only file you change for your brand)
- `src/scenes/`: the scene designs
- `src/videos/`: one cue sheet per video (`demo.json` shows every scene)
- `public/videos/<video-id>/`: each video's audio, screenshots, and word timings
- `public/fonts/`: font files (Outfit and Source Sans 3 by default, Open Font License)
