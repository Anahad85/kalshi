interface TriangleArrowProps {
    color: string;
    direction: 'up' | 'down';
    className?: string;
}

export const TriangleArrow = ({ color, direction, className = '' }: TriangleArrowProps) => {
    const rotation = direction === 'down' ? 'rotate-180' : '';

    return (
        <svg
            className={`${className} ${rotation}`}
            width="90"
            height="90"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Rounded triangle pointing down */}
            <path
                d="M 60 90 L 90 35 Q 92 30 87 28 L 33 28 Q 28 30 30 35 L 60 90"
                fill={color}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
};

