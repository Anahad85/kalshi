import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

const KALSHI_API = 'https://api.elections.kalshi.com/trade-api/v2';

// Proxy for market odds
app.get('/api/markets/:ticker', async (req, res) => {
    try {
        const response = await fetch(`${KALSHI_API}/markets/${req.params.ticker}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy for trades - fetch trades for each ticker separately and combine
app.get('/api/trades', async (req, res) => {
    try {
        const tickers = req.query.ticker.split(',');
        const limit = req.query.limit || 50;
        
        // Fetch trades for each ticker
        const allTrades = [];
        for (const ticker of tickers) {
            const response = await fetch(`${KALSHI_API}/markets/trades?ticker=${ticker.trim()}&limit=${limit}`);
            const data = await response.json();
            if (data.trades) {
                allTrades.push(...data.trades);
            }
        }
        
        // Sort by created_time descending
        allTrades.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
        
        res.json({ trades: allTrades.slice(0, limit) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Proxy server running on http://localhost:${PORT}`);
    console.log(`Forwarding requests to ${KALSHI_API}`);
});

