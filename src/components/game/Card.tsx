import React from 'react';
import { motion } from 'framer-motion';
import { TofuIcon } from '../icons/TofuIcon';
import { Sword, Trophy, Trash2 } from 'lucide-react';
import type { CardData } from '../../types';
import { createPortal } from 'react-dom';

import winnerVideo from '../../assets/winner.mp4';

export const Card = ({ data, onClick, isRevealed, autoReveal = false }: { data: CardData; onClick?: () => void; isRevealed: boolean; autoReveal?: boolean }) => {
    const isWinner = data.type === 'winner';
    const isElimination = data.type === 'elimination';

    const [isPlayingWinnerVideo, setIsPlayingWinnerVideo] = React.useState(false);

    // Handle Auto Reveal
    React.useEffect(() => {
        if (autoReveal && !isRevealed && !isPlayingWinnerVideo) {
            if (isWinner) {
                setIsPlayingWinnerVideo(true);
            } else {
                // Small delay to ensure smooth transition
                const timer = setTimeout(() => {
                    onClick?.();
                }, 500);
                return () => clearTimeout(timer);
            }
        }
    }, [autoReveal, isRevealed, isPlayingWinnerVideo, isWinner, onClick]);

    const handleInteraction = () => {
        if (isWinner && !isRevealed) {
            setIsPlayingWinnerVideo(true);
        } else {
            onClick?.();
        }
    };

    const onVideoEnd = () => {
        setIsPlayingWinnerVideo(false);
        onClick?.();
    };

    return (
        <>
            {isPlayingWinnerVideo && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
                    <video
                        src={winnerVideo}
                        autoPlay
                        className="w-full h-full object-cover"
                        onEnded={onVideoEnd}
                    />
                </div>,
                document.body
            )}

            <div
                onClick={handleInteraction}
                className="relative w-40 h-64 perspective-1000 cursor-pointer group"
            >
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    initial={false}
                    animate={{ rotateY: isRevealed ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                    {/* CARD BACK (Face Down) */}
                    <div className="absolute inset-0 backface-hidden rounded-xl border border-white/10 bg-black/80 flex items-center justify-center shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 backdrop-blur-sm">
                        {/* Subtle Pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]" />

                        {/* Center Icon */}
                        <div className="relative z-10 flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity">
                            <Sword className="text-white mb-2" size={32} />
                            <div className="font-fantasy text-[10px] tracking-[0.3em] text-white/50 uppercase">Fate</div>
                        </div>
                    </div>

                    {/* CARD FRONT (Face Up) */}
                    <div
                        className={`absolute inset-0 backface-hidden rounded-xl shadow-2xl overflow-hidden rotate-y-180 backdrop-blur-md border 
            ${isWinner ? 'bg-amber-900/30 border-amber-500/30' :
                                isElimination ? 'bg-red-900/30 border-red-500/30' : 'bg-white/5 border-white/10'}`}
                    >
                        <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center p-4 text-center relative z-10 text-white">

                            {/* Icon */}
                            <div className="mb-3">
                                {isWinner && <Trophy size={32} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
                                {isElimination && <Trash2 size={32} className="text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]" />}
                                {!isWinner && !isElimination && <TofuIcon size={24} className="text-white/20" />}
                            </div>

                            {/* Rarity/Type Label */}
                            <h3 className={`font-fantasy text-[10px] uppercase tracking-widest mb-3 border-b border-white/10 pb-1 w-full 
                            ${isWinner ? 'text-amber-200' : isElimination ? 'text-red-200' : 'text-white/30'}`}>
                                {isWinner ? "The Chosen One" : isElimination ? "Elimination Card" : "Common"}
                            </h3>

                            {/* Content */}
                            <p className={`font-fantasy text-sm leading-snug line-clamp-4 ${isWinner ? 'text-amber-50 font-medium' : isElimination ? 'text-red-50' : 'text-white/80'}`}>
                                {data.content}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};
