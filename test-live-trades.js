import fetch from 'node-fetch';

const CUOMO_TICKER = 'KXMAYORNYCPARTY-25-AC';
const MAMDANI_TICKER = 'KXMAYORNYCPARTY-25-D';
const KALSHI_API = 'https://api.elections.kalshi.com/trade-api/v2';

let lastTradeIds = new Set();

async function fetchLatestTrades() {
    try {
        console.log('\n🔄 Fetching latest trades...\n');
        
        // Fetch trades for both markets
        const [cuomoResponse, mamdaniResponse] = await Promise.all([
            fetch(`${KALSHI_API}/markets/trades?ticker=${CUOMO_TICKER}&limit=10`),
            fetch(`${KALSHI_API}/markets/trades?ticker=${MAMDANI_TICKER}&limit=10`)
        ]);
        
        const cuomoData = await cuomoResponse.json();
        const mamdaniData = await mamdaniResponse.json();
        
        const allTrades = [
            ...(cuomoData.trades || []),
            ...(mamdaniData.trades || [])
        ];
        
        // Sort by time descending
        allTrades.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
        
        console.log('📊 MOST RECENT TRADES:\n');
        console.log('═'.repeat(80));
        
        allTrades.slice(0, 10).forEach((trade, i) => {
            const isNew = !lastTradeIds.has(trade.trade_id);
            const candidate = trade.ticker.includes('AC') ? 'CUOMO' : 'MAMDANI';
            const price = trade.taker_side === 'yes' ? trade.yes_price : trade.no_price;
            const tradeValue = trade.count * price;
            const displayValue = `$${(tradeValue / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
            const time = new Date(trade.created_time).toLocaleTimeString();
            const newFlag = isNew ? '🆕' : '  ';
            
            console.log(`${newFlag} ${i + 1}. ${displayValue.padEnd(12)} on ${candidate.padEnd(8)} | ${trade.count} contracts @ ${price}¢ | ${time}`);
            
            lastTradeIds.add(trade.trade_id);
        });
        
        console.log('═'.repeat(80));
        console.log(`\n✅ Total trades in last batch: ${allTrades.length}`);
        
        // Show current odds
        const cuomoMarket = await fetch(`${KALSHI_API}/markets/${CUOMO_TICKER}`);
        const mamdaniMarket = await fetch(`${KALSHI_API}/markets/${MAMDANI_TICKER}`);
        
        const cuomoOdds = await cuomoMarket.json();
        const mamdaniOdds = await mamdaniMarket.json();
        
        console.log(`\n📈 CURRENT ODDS:`);
        console.log(`   Cuomo: ${cuomoOdds.market?.last_price}%`);
        console.log(`   Mamdani: ${mamdaniOdds.market?.last_price}%`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

console.log('🎯 KALSHI LIVE TRADES MONITOR');
console.log('Press Ctrl+C to stop\n');

// Fetch immediately
fetchLatestTrades();

// Then fetch every 5 seconds
setInterval(fetchLatestTrades, 5000);

