import { useEffect, useState, useRef } from 'react';

import { observer } from 'mobx-react';
import { AnimatedCounter } from 'react-animated-counter';

import { fetchMarketOdds } from './api/api';
import { LiveTradesAnimation } from './LiveTradesAnimation';
import { LiveTradesIndicator } from './LiveTradesIndicator';
import KalshiLogo from './KalshiLogo';
import { Palette } from './DesignSystem2/Theme';

import { TriangleArrow } from './TriangleArrow';

// Constants - College Football Game Miami vs Mississippi
// Each team has its own market ticker
const MIAMI_MARKET_TICKER = 'KXNCAAFGAME-26JAN08MIAMISS-MIA';
const OLEMISS_MARKET_TICKER = 'KXNCAAFGAME-26JAN08MIAMISS-MISS';

// Odds update constants
const ODDS_POLLING_INTERVAL = 5000; // 5 seconds

// Set to true to see animation demo with changing values
const DEMO_MODE = false;

const MSGMain1545x960 = () => {
    // Real-time odds from Kalshi API
    const [florida, setFlorida] = useState(50);
    const [oleMiss, setOleMiss] = useState(50);

    useEffect(() => {
        if (DEMO_MODE) {
            // Demo mode: cycle through different values to show animation
            const demoValues = [
                { miami: 61, oleMiss: 39 },
                { miami: 55, oleMiss: 45 },
                { miami: 68, oleMiss: 32 },
                { miami: 45, oleMiss: 55 },
                { miami: 72, oleMiss: 28 },
                { miami: 61, oleMiss: 39 },
            ];
            let index = 0;
            
            const demoInterval = setInterval(() => {
                const values = demoValues[index];
                setFlorida(values.miami);
                setOleMiss(values.oleMiss);
                console.log(`🎬 Demo: Miami ${values.miami}% | Ole Miss ${values.oleMiss}%`);
                index = (index + 1) % demoValues.length;
            }, 3000);
            
            return () => clearInterval(demoInterval);
        }
        
        const fetchOdds = async () => {
            // Fetch both team's markets
            const [miamiOdds, oleMissOdds] = await Promise.all([
                fetchMarketOdds(MIAMI_MARKET_TICKER),
                fetchMarketOdds(OLEMISS_MARKET_TICKER)
            ]);

            if (miamiOdds !== null && oleMissOdds !== null) {
                // Normalize odds to add up to 100%
                const total = miamiOdds + oleMissOdds;
                const normalizedMiami = Math.round((miamiOdds / total) * 100);
                const normalizedOleMiss = 100 - normalizedMiami; // Ensure exactly 100%
                
                setFlorida(normalizedMiami);
                setOleMiss(normalizedOleMiss);
                console.log(`✅ Miami: ${normalizedMiami}% | Ole Miss: ${normalizedOleMiss}% (raw: ${miamiOdds}/${oleMissOdds})`);
            }
        };

        fetchOdds();
        const interval = setInterval(fetchOdds, ODDS_POLLING_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return (
        <div 
            className="relative h-[1080px] w-[1920px] overflow-hidden"
            style={{
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        >
            {/* Left side - Florida */}
            <div
                className="absolute left-0 top-0 bottom-0"
                style={{
                    width: '50%',
                    overflow: 'hidden',
                }}
            >
                {/* Florida player image - full background */}
                <img 
                    src="/images/nyc-mayor/Beck-scaled.jpg" 
                    alt="Florida Player" 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: '45% center',
                    }}
                />
                {/* Dark tint overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.2)',
                }} />
            </div>

            {/* Right side - Ole Miss */}
            <div
                className="absolute right-0 top-0 bottom-0"
                style={{
                    width: '50%',
                    overflow: 'hidden',
                }}
            >
                {/* Ole Miss player image - full background */}
                <img 
                    src="/images/nyc-mayor/s-l400.jpg" 
                    alt="Ole Miss Player" 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)',
                    }}
                />
                {/* Dark tint overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.2)',
                }} />
            </div>

            {/* Title at top - overlaying the border */}
            <div 
                className="absolute top-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                style={{ zIndex: 15 }}
            >
                <KalshiLogo color="white" height="100px" />
                <div className="text-text-white text-[100px] font-extrabold tracking-tight drop-shadow-lg whitespace-nowrap" style={{ textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
                    MIAMI VS MISSISSIPPI
                </div>
            </div>
            {/* Rectangle 11114159 - Dark gradient overlay */}
            {/* Mask group */}
            <div
                style={{
                    position: 'absolute',
                    width: '1950px',
                    height: '690px',
                    left: '-15px',
                    top: '390px',
                    pointerEvents: 'none',
                }}
            >
                <svg width="1950" height="690" viewBox="0 0 1950 690" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask
                        id="mask0_216_47"
                        style={{ maskType: 'alpha' }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="1950"
                        height="690"
                    >
                        <rect width="1950" height="690" fill="url(#paint0_linear_216_47)" />
                    </mask>
                    <g mask="url(#mask0_216_47)">
                        <rect y="-594" width="1950" height="1284" fill="url(#paint1_linear_216_47)" />
                    </g>
                    <defs>
                        <linearGradient
                            id="paint0_linear_216_47"
                            x1="975"
                            y1="690"
                            x2="963"
                            y2="0.3"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0.331731" stopColor="white" />
                            <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient
                            id="paint1_linear_216_47"
                            x1="15"
                            y1="-18"
                            x2="1935"
                            y2="-9"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0.269231" stopColor="#00A651" />
                            <stop offset="0.735577" stopColor="#D32F2F" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>


            {/* Middle faded trades column */}

            {/* Left odds block - Florida */}
            <div 
                className="absolute left-[25%] top-[380px] z-10"
                style={{
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                }}
            >
                <div className="flex items-baseline justify-center gap-0">
                    <AnimatedCounter
                        value={florida}
                        fontSize="320px"
                        color="white"
                        incrementColor="white"
                        decrementColor="white"
                        includeDecimals={false}
                        containerStyles={{
                            fontWeight: 800,
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            lineHeight: 1,
                        }}
                    />
                    <div className="text-[320px] leading-none font-extrabold text-text-white tracking-tight drop-shadow-lg">%</div>
                </div>
                <div className="mt-8 flex justify-center items-center" style={{ height: '300px' }}>
                    <img src="/images/nyc-mayor/Miami Florida.svg" alt="Florida Logo" height="400" width="400" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }} />
                </div>
            </div>

            {/* Right odds block - Ole Miss */}
            <div 
                className="absolute right-[25%] top-[380px] z-10"
                style={{
                    transform: 'translateX(50%)',
                    textAlign: 'center',
                }}
            >
                <div className="flex items-baseline justify-center gap-0">
                    <AnimatedCounter
                        value={oleMiss}
                        fontSize="320px"
                        color="white"
                        incrementColor="white"
                        decrementColor="white"
                        includeDecimals={false}
                        containerStyles={{
                            fontWeight: 800,
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            lineHeight: 1,
                        }}
                    />
                    <div className="text-[320px] leading-none font-extrabold text-text-white tracking-tight drop-shadow-lg">%</div>
                </div>
                <div className="mt-8 flex justify-center items-center" style={{ height: '300px', overflow: 'visible' }}>
                    <img src="/images/nyc-mayor/Ole Miss Logo.svg" alt="Ole Miss Logo" height="180" width="550" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }} />
                </div>
            </div>

            {/* QR Code - Top Right */}
            <div 
                className="absolute top-[31px] right-[10px]"
                style={{ zIndex: 10 }}
            >
                <img src="/images/nyc-mayor/5uVxJi.svg" alt="QR Code" width="250" height="250" />
            </div>

        </div>
    );
};

export default observer(MSGMain1545x960);

