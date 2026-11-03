// Usage: npm run render -- <video-id> [half|full]
// Renders out/<video-id>[-size].mp4 with the voiceover included.
import { execSync } from 'node:child_process';
const [id, size] = process.argv.slice(2);
if (!id) { console.error('Usage: npm run render -- <video-id> [half|full]'); process.exit(1); }
const comp = size ? `${id}-${size}` : id;
execSync(`npx remotion render src/index.ts ${comp} out/${comp}.mp4`, { stdio: 'inherit' });
