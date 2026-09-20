# Video Downloader — Web

Same UI as the Android app, deployed on Vercel.

## Deploy

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Click Deploy
4. Done!

## Tech

- **Frontend**: Vanilla HTML/CSS/JS (SPA)
- **Backend**: Vercel Serverless Functions
- **Downloader**: `@distube/ytdl-core`

## Limitations

- Only **YouTube** URLs supported on web (Vercel can't run yt-dlp binary)
- Vercel Hobby plan: 10s function timeout (Pro: 60s)
- Large videos may fail on free plan

## Local Dev

```bash
npm install
npx vercel dev
