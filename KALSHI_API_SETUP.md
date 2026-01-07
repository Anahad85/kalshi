# Kalshi API Setup Instructions

To display real-time odds from Kalshi, you need to set up API authentication.

## Step 1: Generate API Credentials

1. Go to [https://kalshi.com](https://kalshi.com) and log in to your account
2. Navigate to **Account Settings** → **API Keys**
3. Click **"Create New API Key"**
4. Save both the **Key ID** and **Private Key** (the private key won't be shown again!)

## Step 2: Create `.env` File

Create a `.env` file in the project root with your credentials:

```bash
# Kalshi API Credentials
KALSHI_API_KEY_ID=your_key_id_here
KALSHI_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_private_key_content_here
-----END PRIVATE KEY-----"
```

**Important:** Make sure the private key includes the BEGIN and END lines and all newlines are preserved.

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Development Setup

### Option A: Using Vite Dev Server (Current Setup)
The Vite proxy should work but currently has authentication issues. The code will try to use the proxy.

```bash
npm run dev
```

###  Option B: Using Proxy Server (Recommended for Dev)
Run the dedicated proxy server that handles authentication:

```bash
npm run proxy
```

Then update the API code to use `http://localhost:3001/api/markets/...`

## Step 5: Production (Netlify)

For production on Netlify:

1. Go to your Netlify site dashboard
2. Navigate to **Site Settings** → **Environment Variables**
3. Add the two environment variables:
   - `KALSHI_API_KEY_ID`
   - `KALSHI_PRIVATE_KEY`

The Netlify function will automatically use these credentials.

## Verify It's Working

When the odds are fetching successfully:
- Check the browser console for logs showing "Florida: X, Ole Miss: Y"
- The display should show real percentages instead of 50/50
- The odds will update every 5 seconds

## Troubleshooting

- **404 errors:** Check that the market ticker is correct: `kxncaafgame-26jan08miamiss`
- **Authentication errors:** Verify your API key and private key are correct
- **CORS errors:** Make sure you're using the proxy (not direct API calls in the browser)

