
import { motion } from 'framer-motion';
import { TofuIcon } from '../icons/TofuIcon';
import { SkipForward } from 'lucide-react';
import { Card } from './Card';
import type { CardData } from '../../types';

interface ResultsGridProps {
    isWishing: boolean;
    isRevealing: boolean;
    results: CardData[];
    revealedIndices: number[];
    revealCard: (idx: number) => void;
    skipReveal: () => void;
    closeReveal: () => void;
}

export const ResultsGrid = ({
    isWishing,
    isRevealing,
    results,
    revealedIndices,
    revealCard,
    skipReveal,
    closeReveal
}: ResultsGridProps) => {

    const allRevealed = results.length > 0 && revealedIndices.length === results.length;

    return (
        <div className="flex-1 flex flex-col relative rounded-3xl overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 w-full h-full">

                {/* IDLE */}
                {!isWishing && !isRevealing && (
                    <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-[#a1887f] flex flex-col items-center opacity-80 mix-blend-screen">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 green-500 blur-3xl opacity-20" />
                                <div className="w-32 h-32 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                    <TofuIcon size={64} className="text-white/80" />
                                </div>
                            </div>
                            <p className="text-3xl font-fantasy italic tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center">
                                Sliding Tofu <br /> Gacha Reward Awaits
                            </p>
                        </div>
                    </div>
                )}

                {/* REVEAL GRID */}
                {isRevealing && (
                    <div className="w-full flex flex-col items-center h-full justify-center">
                        {/* Skip */}
                        {!allRevealed && (
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={skipReveal}
                                    className="flex items-center gap-2 text-white/50 hover:text-white font-fantasy text-sm uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-md"
                                >
                                    <SkipForward size={16} /> Fast Forward
                                </button>
                            </div>
                        )}

                        {/* Cards */}
                        <div className="flex flex-wrap gap-8 justify-center perspective-2000 py-8 px-12 pb-48 max-h-full overflow-y-auto custom-scrollbar w-full">
                            {results.map((card, idx) => (
                                <Card
                                    key={card.id}
                                    data={card}
                                    isRevealed={revealedIndices.includes(idx)}
                                    autoReveal={results.length === 1}
                                    onClick={() => !revealedIndices.includes(idx) && revealCard(idx)}
                                />
                            ))}
                        </div>

                        {/* Done */}
                        {allRevealed && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-12 z-50"
                            >
                                <button
                                    onClick={closeReveal}
                                    className="px-12 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform text-lg tracking-widest uppercase font-fantasy border border-white/20 backdrop-blur-md"
                                >
                                    Accept Meaning
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
