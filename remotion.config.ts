import { Config } from '@remotion/cli/config';
import fs from 'node:fs';
import path from 'node:path';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');

// Which browser renders the frames:
// 1. REMOTION_BROWSER if set
// 2. In Claude Code cloud sessions, the preinstalled Chromium (Remotion can't download its own there)
// 3. Otherwise Remotion downloads and uses its own (normal on a Mac)
const findCloudBrowser = () => {
  const root = '/opt/pw-browsers';
  if (!fs.existsSync(root)) return undefined;
  for (const dir of fs.readdirSync(root)) {
    const p = path.join(root, dir, 'chrome-linux', 'headless_shell');
    if (dir.startsWith('chromium_headless_shell') && fs.existsSync(p)) return p;
  }
  return undefined;
};
const browser = process.env.REMOTION_BROWSER || findCloudBrowser();
if (browser) Config.setBrowserExecutable(browser);
