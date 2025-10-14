import { useEffect, useState, useRef } from 'react';

import { observer } from 'mobx-react';
import { AnimatedCounter } from 'react-animated-counter';

import { fetchMarketOdds } from './api/api';
import { LiveTradesAnimation } from './LiveTradesAnimation';
import { LiveTradesIndicator } from './LiveTradesIndicator';
import KalshiLogo from './KalshiLogo';
import { Palette } from './DesignSystem2/Theme';

import { TriangleArrow } from './TriangleArrow';

// Constants
const EVENT_TICKER = 'KXMAYORNYCPARTY-25';
const CUOMO_MARKET_TICKER = 'KXMAYORNYCPARTY-25-AC';
const MAMDANI_MARKET_TICKER = 'KXMAYORNYCPARTY-25-D';

// Odds update constants
const ODDS_POLLING_INTERVAL = 5000; // 5 seconds

const MSGMain1545x960 = () => {
    // Real-time odds from Kalshi API
    const [mamdani, setMamdani] = useState(88);
    const [cuomo, setCuomo] = useState(12);

    useEffect(() => {
        const fetchOdds = async () => {
            console.log('[ODDS] Fetching latest odds...');
            const [cuomoOdds, mamdaniOdds] = await Promise.all([
                fetchMarketOdds(CUOMO_MARKET_TICKER),
                fetchMarketOdds(MAMDANI_MARKET_TICKER)
            ]);

            console.log('[ODDS] Received - Cuomo:', cuomoOdds, 'Mamdani:', mamdaniOdds);

            if (cuomoOdds !== null) {
                setCuomo(cuomoOdds);
                console.log('[ODDS] Updated Cuomo to:', cuomoOdds);
            }
            if (mamdaniOdds !== null) {
                setMamdani(mamdaniOdds);
                console.log('[ODDS] Updated Mamdani to:', mamdaniOdds);
            }
        };

        console.log('[ODDS] Starting odds polling every', ODDS_POLLING_INTERVAL / 1000, 'seconds');
        fetchOdds();
        const interval = setInterval(fetchOdds, ODDS_POLLING_INTERVAL);
        return () => {
            console.log('[ODDS] Stopping odds polling');
            clearInterval(interval);
        };
    }, []);

    return (
        <div 
            className="relative h-[864px] w-[1736px] overflow-hidden"
            style={{
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        >
            {/* Overall background gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(90deg, #0D6EFE 0%, #FD942C 100%)',
                }}
            />

            {/* Candidate images */}
            <div className="w-full h-full absolute bottom-0 left-0 right-0 flex flex-row items-end justify-between select-none">
                <img src="/images/nyc-mayor/mamdani_msg.png" alt="Zohran Mamdani" height="800" width="700" />
                <img src="/images/nyc-mayor/cuomo_msg.png" alt="Andrew Cuomo" height="800" width="800" />
            </div>
            {/* Rectangle 11114159 - Dark gradient overlay */}
            {/* Mask group */}
            <div
                style={{
                    position: 'absolute',
                    width: '1760px',
                    height: '552px',
                    left: '-12px',
                    top: '312px',
                    pointerEvents: 'none',
                }}
            >
                <svg width="1760" height="552" viewBox="0 0 1760 552" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask
                        id="mask0_216_47"
                        style={{ maskType: 'alpha' }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="1760"
                        height="552"
                    >
                        <rect width="1760" height="552" fill="url(#paint0_linear_216_47)" />
                    </mask>
                    <g mask="url(#mask0_216_47)">
                        <rect y="-475.317" width="1760" height="1027.32" fill="url(#paint1_linear_216_47)" />
                    </g>
                    <defs>
                        <linearGradient
                            id="paint0_linear_216_47"
                            x1="896.5"
                            y1="552"
                            x2="885.003"
                            y2="0.239541"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0.331731" stopColor="white" />
                            <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient
                            id="paint1_linear_216_47"
                            x1="12.5"
                            y1="-14.5704"
                            x2="1744.51"
                            y2="-7.00114"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0.269231" stopColor="#002ED2" />
                            <stop offset="0.735577" stopColor="#FF5900" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Title and Live Trades pill */}
            <div 
                className="absolute top-[54px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                style={{ marginLeft: '5px' }}
            >
                <KalshiLogo color="white" height="97px" />
                <div className="text-text-white text-[86px] font-extrabold tracking-tight">NEXT NYC MAYOR?</div>
                <LiveTradesIndicator height={56} width={260} fontSize={28} />
                <div 
                    className="mt-6 overflow-hidden" 
                    style={{ 
                        marginLeft: '93px',
                        maxHeight: '500px',
                    }}
                >
                    <LiveTradesAnimation
                        candidates={['MAMDANI', 'CUOMO']}
                        marketTickers={[CUOMO_MARKET_TICKER, MAMDANI_MARKET_TICKER]}
                        tradesToDisplay={7}
                        tradeOpacities={[1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4]}
                        className="w-[480px]"
                        listClassName="flex flex-col gap-[29px]"
                        itemClassName="flex items-center gap-4 text-3xl font-semibold drop-shadow-sm"
                        showSide={true}
                        fontSize={36}
                    />
                </div>
            </div>

            {/* Middle faded trades column */}

            {/* Left odds block */}
            <div className="absolute left-6 bottom-6 z-10">
                <div className="text-[80px] font-extrabold text-text-white tracking-wide leading-none mb-0">MAMDANI</div>
                <div className="flex items-baseline gap-0">
                    <AnimatedCounter
                        value={mamdani}
                        includeDecimals={false}
                        fontSize="200px"
                        digitStyles={{
                            lineHeight: 1,
                            fontWeight: 'Bold',
                        }}
                        color="white"
                        incrementColor="#00D4AA"
                        decrementColor="#FF0000"
                    />
                    <div className="text-[200px] leading-none font-extrabold text-text-white tracking-tighter">%</div>
                    <TriangleArrow color={Palette.Green.x10} direction="up" className="" />
                </div>
            </div>

            {/* Right odds block */}
            <div className="absolute right-6 bottom-6 z-10 text-right">
                <div className="text-[80px] font-extrabold text-text-white tracking-wide leading-none mb-0">CUOMO</div>
                <div className="flex items-baseline justify-end" style={{ gap: '0px' }}>
                    <div style={{ marginRight: '-60px' }}>
                        <TriangleArrow color="#D91616" direction="down" className="" />
                    </div>
                    <AnimatedCounter
                        value={cuomo}
                        includeDecimals={false}
                        fontSize="200px"
                        digitStyles={{
                            lineHeight: 1,
                            fontWeight: 'Bold',
                        }}
                        color="white"
                        incrementColor="#00D4AA"
                        decrementColor="#FF0000"
                    />
                    <div className="text-[200px] leading-none font-extrabold text-text-white tracking-tighter">%</div>
                </div>
            </div>

        </div>
    );
};

export default observer(MSGMain1545x960);

