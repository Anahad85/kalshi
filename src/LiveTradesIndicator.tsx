interface LiveTradesIndicatorProps {
    className?: string;
    width?: number;
    height?: number;
    fontSize?: number;
}

export const LiveTradesIndicator = ({ height = 31, width = 175, fontSize = 20 }: LiveTradesIndicatorProps) => {
    const indicatorDiameter = height * 0.6;
    return (
        <div 
            className="flex items-center rounded-full bg-white gap-2"
            style={{
                height: `${height}px`,
                width: `${width}px`,
                padding: '4px 8px',
            }}
        >
            <div
                className="rounded-full animate-pulse"
                style={{
                    width: `${indicatorDiameter}px`,
                    height: `${indicatorDiameter}px`,
                    backgroundColor: '#FF0000',
                    flexShrink: 0,
                }}
            />
            <span 
                className="font-semibold text-black whitespace-nowrap" 
                style={{ 
                    fontSize: `${fontSize}px`,
                    lineHeight: 1,
                }}
            >
                LIVE TRADES
            </span>
        </div>
    );
};

