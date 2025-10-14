export async function handler(event, context) {
    const ticker = event.queryStringParameters?.ticker;
    
    if (!ticker) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Ticker parameter required' })
        };
    }
    
    try {
        const response = await fetch(
            `https://api.elections.kalshi.com/trade-api/v2/markets/${ticker}`
        );
        
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to fetch from Kalshi' })
            };
        }
        
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}

