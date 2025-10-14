interface Market {
    ticker_name: string;
    last_price: number;
}

interface Event {
    ticker: string;
    markets?: Market[];
}

export const fetchEvent = async (ticker: string): Promise<Event | null> => {
    try {
        const response = await fetch(`https://api.kalshi.com/trade-api/v2/events/${ticker}`);
        if (!response.ok) {
            throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        return data.event;
    } catch (error) {
        console.error('Error fetching event:', error);
        return null;
    }
};

