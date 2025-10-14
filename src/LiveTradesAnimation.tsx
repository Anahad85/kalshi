import { useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { toMoney } from './utils/caseing';
import { fetchRecentTrades, type KalshiTrade } from './api/api';

type TradeData = {
    id: string;
    price: number;
    side: string;
    image_url: string;
    created_at: string;
    pfpColor?: string;
};

// Trade history constants
const TRADE_HISTORY_POLLING_INTERVAL = 30000; // 30 seconds
const NUM_PROFILE_IMAGES = 40;

// Adaptive animation - fast bursts then slower wait periods
const BURST_MODE_PROBABILITY = 0.35;
const BURST_INTERVALS = [250, 350, 450]; // Very fast bursts
const BURST_UPDATE_COUNTS = [6, 8, 10]; // More trades in burst
const NORMAL_INTERVALS = [2000, 2500, 3000]; // Slower wait between bursts

// Seeded random number generator for deterministic content across displays
const seededRandom = (seed: number) => {
    let state = seed;
    return () => {
        state = (state * 9301 + 49297) % 233280;
        return state / 233280;
    };
};

const useTradeUpdateMode = (startTime: number) => {
    const [mode, setMode] = useState<'burst' | 'normal'>('normal');
    const [currentInterval, setCurrentInterval] = useState(NORMAL_INTERVALS[2]);
    const burstCountRef = useRef(0);
    const randomGen = useRef(seededRandom(startTime));

    const updateMode = useCallback(() => {
        if (burstCountRef.current > 0) {
            burstCountRef.current -= 1;
            return;
        }

        const random = randomGen.current();
        // 25% chance to enter burst mode
        if (random < BURST_MODE_PROBABILITY) {
            setMode('burst');
            const burstIdx = Math.floor(randomGen.current() * BURST_INTERVALS.length);
            setCurrentInterval(BURST_INTERVALS[burstIdx]);
            const burstCountIdx = Math.floor(randomGen.current() * BURST_UPDATE_COUNTS.length);
            burstCountRef.current = BURST_UPDATE_COUNTS[burstCountIdx] - 1;
        } else {
            setMode('normal');
            const normalIdx = Math.floor(randomGen.current() * NORMAL_INTERVALS.length);
            setCurrentInterval(NORMAL_INTERVALS[normalIdx]);
        }
    }, []);

    return { mode, currentInterval, updateMode };
};

// Generate a deterministic color based on seed
const getSeededColor = (seed: number) => {
    const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#FFA07A',
        '#98D8C8',
        '#F7DC6F',
        '#BB8FCE',
        '#85C1E2',
        '#F8B739',
        '#52B788',
        '#F06292',
        '#64B5F6',
        '#FFD54F',
        '#4DB6AC',
        '#E57373',
        '#9575CD',
        '#4FC3F7',
        '#FFB74D',
        '#81C784',
        '#FF8A65',
    ];
    return colors[seed % colors.length];
};

// Darken a hex color by a percentage
const darkenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, ((num >> 16) & 0xff) * (1 - percent));
    const g = Math.max(0, ((num >> 8) & 0xff) * (1 - percent));
    const b = Math.max(0, (num & 0xff) * (1 - percent));
    return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
};

const useSignificantTrades = (marketTickers: string[]) => {
    const [tradeHistory, setTradeHistory] = useState<TradeData[]>([]);

    const fetchAndTransformTrades = useCallback(async () => {
        try {
            const apiTrades = await fetchRecentTrades(marketTickers, 100);
            
            if (apiTrades && apiTrades.length > 0) {
                const transformed: TradeData[] = apiTrades.map((trade, index) => {
                    // Determine candidate based on ticker
                    let side = 'UNKNOWN';
                    if (trade.ticker.includes('AC')) {
                        side = 'CUOMO';
                    } else if (trade.ticker.includes('D')) {
                        side = 'MAMDANI';
                    }
                    
                    // Calculate dollar value: count * price (price is already in cents)
                    const priceInCents = trade.taker_side === 'yes' ? trade.yes_price : trade.no_price;
                    const tradeValue = trade.count * priceInCents;
                    
                    return {
                        id: trade.trade_id,
                        price: tradeValue, // Total value in cents
                        side: side,
                        image_url: `/images/election_ads/shared/p${(index % NUM_PROFILE_IMAGES) + 1}-min.png`,
                        created_at: trade.created_time,
                        pfpColor: getSeededColor(index),
                    };
                });
                
                setTradeHistory(transformed);
            }
        } catch (error) {
            console.error('Error fetching real trades:', error);
            // Keep existing trades on error
        }
    }, [marketTickers]);

    useEffect(() => {
        // Initial fetch
        fetchAndTransformTrades();
        
        // Poll for new trades every 10 seconds
        const intervalId = setInterval(fetchAndTransformTrades, 10000);
        
        return () => clearInterval(intervalId);
    }, [fetchAndTransformTrades]);

    return { tradeHistory };
};

interface LiveTradesAnimationProps {
    candidates: string[];
    marketTickers?: string[];
    tradesToDisplay?: number;
    tradeOpacities?: number[];
    showSide?: boolean;
    className?: string;
    listClassName?: string;
    itemClassName?: string;
    fontSize?: number;
}

export const LiveTradesAnimation = ({
    candidates,
    marketTickers = [],
    tradesToDisplay = 7,
    tradeOpacities = [1, 1, 0.8, 0.6, 0.4, 0.2, 0.1],
    className,
    listClassName,
    itemClassName,
    fontSize = 48,
    showSide = false,
}: LiveTradesAnimationProps) => {
    const [trades, setTrades] = useState<TradeData[]>([]);
    const startTimeRef = useRef(Date.now());
    const lastUpdateTimeRef = useRef(Date.now());
    const animationFrameRef = useRef<number>();
    const tradeIdxRef = useRef(0);

    // Use real trades from Kalshi API
    const { tradeHistory } = useSignificantTrades(marketTickers.length > 0 ? marketTickers : candidates);
    const { currentInterval, updateMode } = useTradeUpdateMode(startTimeRef.current);

    // Determine justification based on itemClassName
    const isRightAligned = itemClassName?.includes('text-right');

    const updateTrade = useCallback(() => {
        if (tradeHistory.length > 0) {
            const newTrade = tradeHistory[tradeIdxRef.current];

            setTrades((prevTrades) => {
                const updatedNewTrade = { ...newTrade, key: `${newTrade?.id ?? 'undefined'}-${tradeIdxRef.current}` };
                const newTrades = [updatedNewTrade, ...prevTrades].slice(0, tradesToDisplay);
                return newTrades;
            });

            if (tradeIdxRef.current === tradeHistory.length - 1) {
                tradeIdxRef.current = 0;
            } else {
                tradeIdxRef.current += 1;
            }
        }
    }, [tradeHistory, tradesToDisplay]);

    // Use requestAnimationFrame for smooth, synchronized animations (Cnario best practice)
    useEffect(() => {
        const animate = () => {
            const now = Date.now();
            const elapsed = now - lastUpdateTimeRef.current;

            if (elapsed >= currentInterval) {
                updateTrade();
                updateMode();
                lastUpdateTimeRef.current = now;
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [currentInterval, updateMode, updateTrade]);

    return (
        <div className={className} style={{ overflow: 'hidden' }}>
            <ul className={listClassName}>
                <AnimatePresence initial={false} mode="popLayout">
                    {trades.map((trade, index) => (
                        <motion.li
                            key={trade.id}
                            layout
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{
                                opacity: tradeOpacities[index],
                                y: 0,
                                scale: 1,
                            }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                            className={itemClassName}
                            style={{
                                transformOrigin: 'bottom center',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    whiteSpace: 'nowrap',
                                    gap: fontSize * 0.3,
                                    flexDirection: isRightAligned ? 'row-reverse' : 'row',
                                    justifyItems: isRightAligned ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: tradeOpacities[index] }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        width: fontSize * 0.8,
                                        height: fontSize * 0.8,
                                        borderRadius: '50%',
                                        background: `linear-gradient(to bottom, ${trade.pfpColor}, ${darkenColor(trade.pfpColor || '#000000', 0.2)})`,
                                        border: '0.5px solid rgba(255, 255, 255, 0.3)',
                                        flexShrink: 0,
                                    }}
                                />
                                <div
                                    style={{
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize,
                                    }}
                                >
                                    +{toMoney(trade.price, false)}
                                    {showSide && ' on ' + trade.side}
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
};

