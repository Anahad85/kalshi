import jwt from 'jsonwebtoken';

export async function handler(event, context) {
    const ticker = event.queryStringParameters?.ticker;
    
    if (!ticker) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Ticker parameter required' })
        };
    }
    
    try {
        // Get API credentials from environment variables
        const apiKeyId = process.env.KALSHI_API_KEY_ID;
        const privateKey = process.env.KALSHI_PRIVATE_KEY;
        
        let headers = {
            'Content-Type': 'application/json'
        };
        
        // If credentials are available, add JWT auth
        if (apiKeyId && privateKey) {
            const payload = {
                iss: apiKeyId,
                iat: Math.floor(Date.now() / 1000)
            };
            const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(
            `https://api.elections.kalshi.com/trade-api/v2/markets/${ticker}`,
            { headers }
        );
        
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ 
                    error: 'Failed to fetch from Kalshi',
                    details: await response.text()
                })
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

