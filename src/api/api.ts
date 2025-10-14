export interface KalshiTrade {
    ticker: string;
    count: number;
    yes_price: number;
    no_price: number;
    taker_side: 'yes' | 'no';
    trade_id: string;
    created_time: string;
}

// Get market odds via proxy (bypasses CORS)
export const fetchMarketOdds = async (ticker: string): Promise<number | null> => {
    try {
        const url = `http://localhost:3001/api/markets/${ticker}`;
        console.log(`[API] Fetching from proxy: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`[API] Failed to fetch market ${ticker}: ${response.status}`);
            return null;
        }
        
        const data = await response.json();
        console.log(`[API] Success for ${ticker}:`, data.market?.last_price);
        return data.market?.last_price ?? null;
    } catch (error) {
        console.error(`[API] Error fetching market ${ticker}:`, error);
        return null;
    }
};

// Get recent trades via proxy (bypasses CORS)
export const fetchRecentTrades = async (tickers: string[], limit: number = 50): Promise<KalshiTrade[]> => {
    try {
        const tickerParam = tickers.join(',');
        const url = `http://localhost:3001/api/trades?ticker=${tickerParam}&limit=${limit}`;
        console.log(`[API] Fetching trades from proxy: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`[API] Failed to fetch trades: ${response.status}`);
            return [];
        }
        const data = await response.json();
        console.log(`[API] Received ${data.trades?.length || 0} trades`);
        return data.trades || [];
    } catch (error) {
        console.error('[API] Error fetching trades:', error);
        return [];
    }
};

