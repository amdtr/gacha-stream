import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import type { EliminatedItem } from '../../types';

interface HistorySidebarProps {
    eliminatedItems: EliminatedItem[];
}

export const HistorySidebar = ({ eliminatedItems }: HistorySidebarProps) => {
    return (
        <div className="w-80 flex-none flex flex-col pl-2 h-full pb-6">
            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 flex-1 flex flex-col min-h-0 relative overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="absolute top-2 right-2 opacity-10 text-rose-500"></div>
                <h3 className="font-bold text-white/50 mb-4 uppercase text-xs tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
                    Graveyard
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-h-0 relative z-10">
                    {eliminatedItems.length === 0 && <span className="text-white/30 italic text-sm font-fantasy">The void is empty...</span>}
                    {eliminatedItems.slice().reverse().map((item, idx) => {
                        const isWinner = item.type === 'winner';
                        return (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                key={idx}
                                className={`px-4 py-3 rounded border-l-2 flex justify-between items-center font-fantasy 
                                ${isWinner
                                        ? 'bg-amber-500/10 text-amber-200 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                        : 'bg-red-500/10 text-rose-200 border-rose-500'}`}
                            >
                                <span className={`font-medium truncate ${isWinner ? 'text-amber-100' : ''}`}>{item.content}</span>
                                {isWinner && <Crown size={16} className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
