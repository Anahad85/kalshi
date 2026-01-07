import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
app.use(cors());

const KALSHI_API = 'https://api.elections.kalshi.com/trade-api/v2';
const API_KEY_ID = process.env.KALSHI_API_KEY_ID;
const PRIVATE_KEY = process.env.KALSHI_PRIVATE_KEY;

// Helper function to generate JWT token
function generateJWT() {
    if (!API_KEY_ID || !PRIVATE_KEY) {
        console.warn('⚠️  Kalshi API credentials not found. Set KALSHI_API_KEY_ID and KALSHI_PRIVATE_KEY in .env file');
        return null;
    }
    
    const payload = {
        iss: API_KEY_ID,
        iat: Math.floor(Date.now() / 1000)
    };
    
    return jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });
}

// Proxy for market odds
app.get('/api/markets/:ticker', async (req, res) => {
    try {
        const headers = { 'Content-Type': 'application/json' };
        const token = generateJWT();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${KALSHI_API}/markets/${req.params.ticker}`, { headers });
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Kalshi API error:', data);
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy for trades - fetch trades for each ticker separately and combine
app.get('/api/trades', async (req, res) => {
    try {
        const headers = { 'Content-Type': 'application/json' };
        const token = generateJWT();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const tickers = req.query.ticker.split(',');
        const limit = req.query.limit || 50;
        
        // Fetch trades for each ticker
        const allTrades = [];
        for (const ticker of tickers) {
            const response = await fetch(`${KALSHI_API}/markets/trades?ticker=${ticker.trim()}&limit=${limit}`, { headers });
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

