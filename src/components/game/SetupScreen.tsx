
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface SetupScreenProps {
    inputValue: string;
    setInputValue: (val: string) => void;
    maxPity: number;
    setMaxPity: (val: number) => void;
    allowRepeatedElimination: boolean;
    setAllowRepeatedElimination: (val: boolean) => void;
    onStart: () => void;
}

export const SetupScreen = ({
    inputValue,
    setInputValue,
    maxPity,
    setMaxPity,
    allowRepeatedElimination,
    setAllowRepeatedElimination,
    onStart
}: SetupScreenProps) => {
    return (
        <div className="flex-1 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-black/60 p-10 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden"
            >
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 p-2 text-white/10"><Leaf size={32} /></div>
                <div className="absolute top-0 right-0 p-2 text-white/10 transform scale-x-[-1]"><Leaf size={32} /></div>

                <h2 className="text-3xl font-medieval mb-6 text-center text-amber-500 drop-shadow-md tracking-widest">Scroll of Destiny</h2>
                <textarea
                    className="w-full h-64 bg-white/5 text-amber-50 p-6 rounded-xl border border-white/10 focus:border-amber-500/50 outline-none resize-none font-fantasy text-lg leading-relaxed placeholder-white/20 shadow-inner backdrop-blur-sm transition-all focus:bg-white/10"
                    placeholder="Inscribe the names of the chosen..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="flex gap-4 mt-6">
                    <div className="flex-1">
                        <label className="text-xs uppercase text-white/40 font-bold tracking-wider mb-2 block">Max Pity</label>
                        <input
                            type="number"
                            min="1"
                            max="999"
                            value={maxPity}
                            onChange={(e) => setMaxPity(parseInt(e.target.value) || 60)}
                            className="w-full bg-white/5 text-amber-100 p-3 rounded-xl border border-white/10 focus:border-amber-500/50 outline-none font-fantasy transition-all focus:bg-white/10"
                        />
                    </div>
                    <div className="flex-1 flex items-end">
                        <label className="flex items-center gap-3 cursor-pointer select-none bg-white/5 p-3 rounded-xl border border-white/10 w-full hover:bg-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={allowRepeatedElimination}
                                onChange={(e) => setAllowRepeatedElimination(e.target.checked)}
                                className="w-5 h-5 rounded border-white/20 text-amber-600 focus:ring-amber-500 bg-transparent"
                            />
                            <span className="text-sm font-fantasy text-white/70">Torture Mode</span>
                        </label>
                    </div>
                </div>

                <button
                    onClick={onStart}
                    className="w-full mt-8 bg-white/5 hover:bg-white/10 text-white py-4 rounded-full font-fantasy uppercase tracking-widest font-bold text-xl shadow-lg transform transition active:scale-[0.98] flex justify-center items-center gap-2 border border-white/10 backdrop-blur-sm"
                >
                    <Leaf size={20} /> Open The Portal <Leaf size={20} />
                </button>
            </motion.div>
        </div>
    );
};
