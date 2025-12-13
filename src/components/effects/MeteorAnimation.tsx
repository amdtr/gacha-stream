import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CardData } from '../../types';
import gacha4star from '../../assets/gacha4star.mp4';
import gacha5star from '../../assets/gacha5star.mp4';

export const MeteorAnimation = ({ onComplete, results }: { onComplete: () => void, results: CardData[] }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    // Check for any winner in the pull
    const hasWinner = results.some(r => r.type === 'winner');
    const videoSrc = hasWinner ? gacha5star : gacha4star;

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = 0.6;
            videoRef.current.play().catch(console.error);
        }
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="relative w-full h-full">
                {/* Skip Button (Optional but good UX) */}
                <button
                    onClick={onComplete}
                    className="absolute top-8 right-8 z-50 text-white/50 hover:text-white font-fantasy text-sm uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    Skip Animation
                </button>

                <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-full h-full object-cover"
                    onEnded={onComplete}
                    playsInline
                />
            </div>
        </motion.div>
    );
};
