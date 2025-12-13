import React from 'react';
import { TofuIcon } from '../icons/TofuIcon';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface HeaderProps {
    bgmEnabled: boolean;
    toggleBgm: () => void;
    gameStarted: boolean;
    itemCount: number;
    pityCount: number;
    maxPity: number;
    onReset: () => void;
}

export const Header = ({
    bgmEnabled,
    toggleBgm,
    gameStarted,
    itemCount,
    pityCount,
    maxPity,
    onReset
}: HeaderProps) => {
    return (
        <header className="flex-none flex justify-between items-center mb-6 pb-4 bg-transparent p-6 z-50">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-full ring-1 ring-amber-500/50 backdrop-blur-sm">
                    <TofuIcon className="text-amber-400" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-medieval font-bold text-white tracking-wide drop-shadow-md">
                        Pulls of Fate
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* BGM Toggle */}
                <button onClick={toggleBgm} className={`p-3 rounded-full transition-all backdrop-blur-sm ${bgmEnabled ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                    {bgmEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>

                {gameStarted && (
                    <div className="text-sm font-fantasy flex gap-6 items-center bg-black/50 px-8 py-2 rounded-full border border-white/5 backdrop-blur-md text-amber-100/90">
                        <span>Pool: <span className="text-white text-lg">{itemCount}</span></span>
                        <span className="w-px h-4 bg-white/20" />
                        <span>Pity: <span className={`${pityCount > (maxPity - 6) ? 'text-red-400 animate-pulse' : 'text-white'} text-lg`}>{pityCount}/{maxPity}</span></span>
                        <span className="w-px h-4 bg-white/20" />
                        <button onClick={onReset} className="flex items-center gap-1 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold opacity-70 hover:opacity-100">
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
