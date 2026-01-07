export interface KalshiTrade {
    ticker: string;
    count: number;
    yes_price: number;
    no_price: number;
    taker_side: 'yes' | 'no';
    trade_id: string;
    created_time: string;
}

// Get market odds - uses Vite proxy in dev to avoid CORS
export const fetchMarketOdds = async (ticker: string): Promise<number | null> => {
    try {
        const hostname = window.location.hostname;
        let url: string;
        
        // Localhost: use Vite proxy to avoid CORS
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            url = `/api/kalshi/markets/${ticker}`;
        }
        // Production: direct API call (works from server-side or CORS-enabled environments)
        else {
            url = `https://api.elections.kalshi.com/trade-api/v2/markets/${ticker}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error('API call failed:', response.status);
            return null;
        }
        
        const data = await response.json();
        
        if (data.error) {
            console.error('API error:', data.error);
            return null;
        }
        
        // last_price is in cents (0-100 scale = percentage)
        const odds = data.market?.last_price ?? null;
        return odds;
    } catch (error) {
        console.error('Error fetching odds:', error);
        return null;
    }
};

// Get recent trades - uses Vite proxy in dev, direct API in production (Cnario)
export const fetchRecentTrades = async (tickers: string[], limit: number = 50): Promise<KalshiTrade[]> => {
    try {
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const baseUrl = isDev 
            ? '/api/kalshi'  // Vite proxy in dev
            : 'https://api.elections.kalshi.com/trade-api/v2'; // Direct in production
        
        // Fetch trades for each ticker separately
        const allTrades: KalshiTrade[] = [];
        
        for (const ticker of tickers) {
            const url = `${baseUrl}/markets/trades?ticker=${ticker}&limit=${limit}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data.trades) {
                    allTrades.push(...data.trades);
                }
            }
        }
        
        // Sort by created_time descending
        allTrades.sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime());
        
        return allTrades.slice(0, limit);
    } catch (error) {
        return [];
    }
};

