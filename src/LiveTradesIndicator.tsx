interface LiveTradesIndicatorProps {
    className?: string;
    width?: number;
    height?: number;
    fontSize?: number;
}

export const LiveTradesIndicator = ({ height = 31, width = 175, fontSize = 48 }: LiveTradesIndicatorProps) => {
    const indicatorDiameter = height * 0.6;
    return (
        <div className={`flex items-center rounded-x50 bg-text-white gap-1 h-[${height}px] w-[${width}px] px-1`}>
            <div
                className="rounded-x50 bg-red-x10 animate-pulse"
                style={{
                    width: `${indicatorDiameter}px`,
                    height: `${indicatorDiameter}px`,
                }}
            />
            <span className="font-semibold text-black whitespace-nowrap" style={{ fontSize: `${fontSize}px` }}>
                LIVE TRADES
            </span>
        </div>
    );
};

