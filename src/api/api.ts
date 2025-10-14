export interface KalshiTrade {
    ticker: string;
    count: number;
    yes_price: number;
    no_price: number;
    taker_side: 'yes' | 'no';
    trade_id: string;
    created_time: string;
}

// Get market odds - calls Kalshi API directly (works in Cnario, fails in browsers due to CORS)
export const fetchMarketOdds = async (ticker: string): Promise<number | null> => {
    try {
        const url = `https://api.elections.kalshi.com/trade-api/v2/markets/${ticker}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data.market?.last_price ?? null;
    } catch (error) {
        // CORS error in browsers - will work in Cnario player
        return null;
    }
};

// Get recent trades - calls Kalshi API directly (works in Cnario, fails in browsers due to CORS)
export const fetchRecentTrades = async (tickers: string[], limit: number = 50): Promise<KalshiTrade[]> => {
    try {
        // Fetch trades for each ticker separately
        const allTrades: KalshiTrade[] = [];
        
        for (const ticker of tickers) {
            const url = `https://api.elections.kalshi.com/trade-api/v2/markets/trades?ticker=${ticker}&limit=${limit}`;
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
        // CORS error in browsers - will work in Cnario player
        return [];
    }
};

