

export const TofuIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12.6 3.09l8.63 4.31a2 2 0 0 1 1.11 1.79v7.63a2 2 0 0 1-1.11 1.79l-8.63 4.3a2 2 0 0 1-1.79 0l-8.63-4.3a2 2 0 0 1-1.11-1.79V9.19a2 2 0 0 1 1.11-1.79L10.8 3.09a2 2 0 0 1 1.8 0z" />
        <path d="M3.27 7.5L12 11.86l8.73-4.36" />
        <path d="M12 11.86V21.5" />
    </svg>
);
