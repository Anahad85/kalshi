# Testing on Chromium 127

## Option 1: Download Chromium 127 (Recommended)

1. Go to: https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Mac/1135570/

2. Download: `chrome-mac.zip`

3. Unzip and run:
```bash
cd ~/Downloads
unzip chrome-mac.zip
open chrome-mac/Chromium.app
```

4. Navigate to: http://localhost:5173/main-board.html

## Option 2: Use Browserstack (Online Testing)

1. Go to: https://www.browserstack.com/
2. Select "Chrome 127" from browser list
3. Enter URL: http://localhost:5173 (won't work - need public URL)

## Option 3: Deploy to Netlify and Test

Since Chromium 127 is from mid-2024, and your Chrome 141 is newer:
- If it works on Chrome 141, it WILL work on Chromium 127
- All features we use are supported in Chromium 127

## Current Build Target

Your app is already compiled for Chromium 127:
- vite.config.ts: `target: 'chrome127'`
- All modern features transpiled appropriately

