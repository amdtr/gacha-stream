import React from 'react';

interface ControlsProps {
    poolSize: number;
    performPull: (count: number) => void;
    disabled: boolean;
}

export const Controls = ({ poolSize, performPull, disabled }: ControlsProps) => {
    if (disabled) return null;

    return (
        <div className="absolute bottom-6 right-6 flex gap-4 z-50">
            <button
                disabled={poolSize === 0}
                onClick={() => performPull(1)}
                className="group relative px-6 py-2 rounded-full font-fantasy font-medium transition-all disabled:opacity-50 disabled:grayscale overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 bg-white/5 hover:bg-white/10 text-white min-w-[240px] border border-white/20 backdrop-blur-md uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
                <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">Draw 1</span>
                    <span className="w-px h-4 bg-white/20 mx-2" />
                    <span className="text-[10px] opacity-60">Single Fate</span>
                </span>
            </button>

            <button
                disabled={poolSize === 0}
                onClick={() => performPull(6)}
                className="group relative px-6 py-2 rounded-full font-fantasy font-medium transition-all disabled:opacity-50 disabled:grayscale overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 bg-white/5 hover:bg-white/10 text-white min-w-[240px] border border-white/20 backdrop-blur-md uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
                <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg text-amber-100">Draw 6</span>
                    <span className="w-px h-4 bg-white/20 mx-2" />
                    <span className="text-[10px] text-amber-200/50">Mass Ruin</span>
                </span>
            </button>
        </div>
    );
};
