import { useEffect, useState, useRef } from 'react';

import { observer } from 'mobx-react';
import { AnimatedCounter } from 'react-animated-counter';

import { fetchEvent } from './api/api';
import { LiveTradesAnimation } from './LiveTradesAnimation';
import { LiveTradesIndicator } from './LiveTradesIndicator';
import KalshiLogo from './KalshiLogo';

import MSGQrCode from './components/MSGQrCode';
import { TriangleArrow } from './TriangleArrow';

// Constants
const EVENT_TICKER = 'KXMAYORNYCPARTY-25';
const CUOMO_MARKET_TICKER = 'KXMAYORNYCPARTY-25-AC';
const MAMDANI_MARKET_TICKER = 'KXMAYORNYCPARTY-25-D';

// Odds update constants
const ODDS_POLLING_INTERVAL = 5000; // 5 seconds

interface MSGTotemProps {
    candidate: 'mamdani' | 'cuomo';
}

const MSGTotem = ({ candidate }: MSGTotemProps) => {
    const isMamdani = candidate === 'mamdani';
    const [odds, setOdds] = useState(isMamdani ? 32 : 68);
    const [apiError, setApiError] = useState(false);
    const lastUpdateRef = useRef(Date.now());

    // Fetch latest odds - use real market prices with failsafe (Cnario best practice)
    useEffect(() => {
        const fetchLatestOdds = async () => {
            try {
                const event = await fetchEvent(EVENT_TICKER);
                const cuomoMarket = event?.markets?.find((m: any) => m.ticker_name === CUOMO_MARKET_TICKER);
                const mamdaniMarket = event?.markets?.find((m: any) => m.ticker_name === MAMDANI_MARKET_TICKER);

                if (cuomoMarket && mamdaniMarket) {
                    setOdds(isMamdani ? mamdaniMarket.last_price : cuomoMarket.last_price);
                    setApiError(false);
                    lastUpdateRef.current = Date.now();
                } else if (cuomoMarket) {
                    setOdds(isMamdani ? 100 - cuomoMarket.last_price : cuomoMarket.last_price);
                    setApiError(false);
                    lastUpdateRef.current = Date.now();
                } else if (mamdaniMarket) {
                    setOdds(isMamdani ? mamdaniMarket.last_price : 100 - mamdaniMarket.last_price);
                    setApiError(false);
                    lastUpdateRef.current = Date.now();
                }
            } catch (error) {
                // Cnario best practice: continue with last known values, no visual disruption
                console.error('API Error - using cached odds:', error);
                setApiError(true);
            }
        };

        // Initial fetch
        fetchLatestOdds();

        // Use requestAnimationFrame for polling (Cnario best practice)
        let animationFrameId: number;
        let lastPollTime = Date.now();

        const poll = () => {
            const now = Date.now();
            if (now - lastPollTime >= ODDS_POLLING_INTERVAL) {
                fetchLatestOdds();
                lastPollTime = now;
            }
            animationFrameId = requestAnimationFrame(poll);
        };

        animationFrameId = requestAnimationFrame(poll);

        // Clean up
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isMamdani]);

    const name = isMamdani ? 'MAMDANI' : 'CUOMO';
    const imageSrc = isMamdani ? '/images/nyc-mayor/mamdani_totem.png' : '/images/nyc-mayor/cuomo_totem.png';
    const direction = isMamdani ? 'up' : 'down';
    const arrowColor = isMamdani ? '#00D4AA' : '#FF0000';

    return (
        <div 
            className="relative h-[864px] w-[432px] overflow-hidden"
            style={{
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
            }}
        >
            {/* Background gradient */}
            {candidate == 'cuomo' && (
                <svg width="432" height="864" viewBox="0 0 432 864" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="432" height="864" fill="url(#paint0_linear_218_1237)" />
                    <defs>
                        <linearGradient
                            id="paint0_linear_218_1237"
                            x1="216"
                            y1="0"
                            x2="216"
                            y2="864"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#F99330" />
                            <stop offset="1" stopColor="#FA5804" />
                        </linearGradient>
                    </defs>
                </svg>
            )}

            {candidate == 'mamdani' && (
                <svg width="432" height="864" viewBox="0 0 432 864" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_221_2892)">
                        <rect width="432" height="864" fill="#D91616" />
                        <rect width="432" height="864" fill="url(#paint0_linear_221_2892)" />
                        <rect y="400" width="432" height="464" fill="url(#paint1_linear_221_2892)" />
                    </g>
                    <defs>
                        <linearGradient
                            id="paint0_linear_221_2892"
                            x1="216"
                            y1="0"
                            x2="216"
                            y2="864"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#0E6EFC" />
                            <stop offset="1" stopColor="#022FD0" />
                        </linearGradient>
                        <linearGradient
                            id="paint1_linear_221_2892"
                            x1="216"
                            y1="400"
                            x2="212.101"
                            y2="863.967"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#003C94" stopOpacity="0" />
                            <stop offset="1" stopColor="#002196" />
                        </linearGradient>
                        <clipPath id="clip0_221_2892">
                            <rect width="432" height="864" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            )}

            {/* Candidate image */}
            {candidate == 'cuomo' && (
                <div className="absolute bottom-0 right-0 flex justify-center mix-blend-luminosity select-none">
                    <img src={imageSrc} alt={name} height="587" width="432" />
                </div>
            )}
            {candidate == 'mamdani' && (
                <div className="absolute bottom-[0px] right-0 flex justify-center mix-blend-luminosity select-none">
                    <img src={imageSrc} alt={name} height="587" width="432" />
                </div>
            )}

            {/* Background gradient */}
            {candidate == 'cuomo' && (
                <svg width="432" height="464" viewBox="0 0 432 464" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="432" height="464" fill="url(#paint0_linear_218_1241)" />
                    <defs>
                        <linearGradient
                            id="paint0_linear_218_1241"
                            x1="216"
                            y1="0"
                            x2="216"
                            y2="464"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#F99330" stopOpacity="0" />
                            <stop offset="1" stopColor="#CE4600" />
                        </linearGradient>
                    </defs>
                </svg>
            )}

            {candidate == 'mamdani' && (
                <svg width="432" height="464" viewBox="0 0 432 464" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="432" height="464" fill="url(#paint0_linear_218_1792)" />
                    <defs>
                        <linearGradient
                            id="paint0_linear_218_1792"
                            x1="216"
                            y1="-1.33027e-07"
                            x2="212.101"
                            y2="463.967"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#003C94" stopOpacity="0" />
                            <stop offset="1" stopColor="#002196" />
                        </linearGradient>
                    </defs>
                </svg>
            )}

            {/* Header */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 h-full w-[560px]">
                <KalshiLogo color="white" height="55px" />
                <LiveTradesIndicator height={36} width={200} fontSize={16} />
                <div className="flex items-baseline">
                    <AnimatedCounter
                        value={odds}
                        includeDecimals={false}
                        fontSize="120px"
                        digitStyles={{
                            lineHeight: 1,
                            fontWeight: 'Bold',
                            letterSpacing: '-0.06em',
                        }}
                        color="white"
                        incrementColor="#00D4AA"
                        decrementColor="#FF0000"
                    />
                    <div className="text-[120px] leading-none font-extrabold text-text-white">%</div>
                    <TriangleArrow color={arrowColor} direction={direction} />
                </div>
                {isMamdani ? (
                    <div className="absolute bottom-8 left-[36px] w-[560px]">
                        <LiveTradesAnimation
                            candidates={[name.toUpperCase()]}
                            tradesToDisplay={11}
                            tradeOpacities={[1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05]}
                            className="w-full"
                            listClassName="flex flex-col gap-[17px] text-left"
                            itemClassName="flex items-center text-left font-semibold drop-shadow-sm"
                            showSide={true}
                            fontSize={24}
                        />
                    </div>
                ) : (
                    <div className="absolute bottom-8 right-[80px] w-[560px]">
                        <LiveTradesAnimation
                            candidates={[name.toUpperCase()]}
                            tradesToDisplay={11}
                            tradeOpacities={[1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05]}
                            className="w-full"
                            listClassName="flex flex-col gap-[17px] text-right"
                            itemClassName="flex items-center text-right font-semibold drop-shadow-sm"
                            showSide={true}
                            fontSize={24}
                        />
                    </div>
                )}
            </div>
            {/* QR code location varies by candidate */}
            {isMamdani ? (
                <div className="absolute bottom-3 right-3">
                    <MSGQrCode size={80} />
                </div>
            ) : (
                <div className="absolute bottom-3 left-3">
                    <MSGQrCode size={80} />
                </div>
            )}
        </div>
    );
};

export default observer(MSGTotem);

