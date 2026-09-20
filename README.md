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
```

---

## 🚀 Vercel pe Deploy Karne ke Steps

### **Step 1: GitHub repo banao**
👉 https://github.com/new → name: `video-downloader-web` → Public → Create

### **Step 2: Files upload karo**
Saari 7 files upload karo (structure ke hisaab se).

### **Step 3: Vercel pe jao**
👉 https://vercel.com → **Sign up with GitHub**

### **Step 4: Import Project**
- Dashboard me **"Add New…" → "Project"**
- Apna `video-downloader-web` repo select karo
- **Framework Preset**: `Other`
- **Build Command**: *(khali chhodo)*
- **Output Directory**: *(khali chhodo)*
- **Install Command**: `npm install`
- **Deploy** click karo

### **Step 5: Done! 🎉**
2 min me live URL milega jaise:

https://video-downloader-web-xyz.vercel.app/


---

## ✅ Kya Kaam Karega

| Feature | Status |
|---|---|
| Exact same UI as app | ✅ |
| Bottom navbar with animations | ✅ |
| Home screen (URL + Paste + Download) | ✅ |
| Result screen (thumbnail + title + 4 buttons) | ✅ |
| Downloads history (localStorage) | ✅ |
| Profile screen | ✅ |
| YouTube video download | ✅ |
| Progress bar | ✅ |
| Toast notifications | ✅ |

---

## ⚠️ Limitations

1. **Sirf YouTube** — Vercel me yt-dlp binary nahi chalti. TikTok/Instagram ke liye third-party API lagani padegi (RapidAPI etc.)
2. **Vercel timeout** — Free plan pe 10s, Pro pe 60s. Bade videos fail ho sakte hain
3. **Content-Length missing** — Kabhi kabhi progress bar % ki jagah size dikhayega
4. **CORS/Headers** — Vercel kabhi kabhi response size limit karti hai

---

## 🔧 Optional: TikTok/Instagram Support

Agar TikTok/Instagram support chahiye to `api/info.js` me RapidAPI call add kar do:

```javascript
// Example (RapidAPI)
const RAPID_API_KEY = process.env.RAPID_API_KEY;

if (url.includes('tiktok.com')) {
  const r = await fetch(`https://tiktok-downloader.p.rapidapi.com/...`, {
    headers: { 'X-RapidAPI-Key': RAPID_API_KEY }
  });
  const data = await r.json();
  // map to our format...
}
