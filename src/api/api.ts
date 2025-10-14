// Simplified API - just get market odds
export const fetchMarketOdds = async (ticker: string): Promise<number | null> => {
    try {
        const response = await fetch(`https://api.elections.kalshi.com/trade-api/v2/markets/${ticker}`);
        if (!response.ok) {
            console.error(`Failed to fetch market ${ticker}: ${response.status}`);
            return null;
        }
        const data = await response.json();
        console.log(`Market ${ticker} data:`, data);
        return data.market?.last_price ?? null;
    } catch (error) {
        console.error('Error fetching market odds:', error);
        return null;
    }
};

