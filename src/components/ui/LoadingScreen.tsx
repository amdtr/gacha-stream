
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
    assets: string[];
    onComplete: () => void;
}

export const LoadingScreen = ({ assets, onComplete }: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const resources = assets.map(url => ({
            url,
            loaded: 0,
            total: 0,
            done: false
        }));

        const updateProgress = () => {
            if (!isMounted) return;

            // Calculate total bytes expected and loaded
            // For files where total is unknown (yet or ever), we can't sum cleanly.
            // Strategy: Average percent across all files (Each file = 1/Nth of bar)
            // This prevents jumps when new files start and add to the 'total bytes' denominator.
            const totalPercent = resources.reduce((acc, r) => {
                const p = r.total > 0 ? (r.loaded / r.total) : (r.done ? 1 : 0);
                return acc + p;
            }, 0);

            const overallProgress = (totalPercent / resources.length) * 100;
            setProgress(Math.round(overallProgress));

            // Update count text
            const completedCount = resources.filter(r => r.done).length;
            setLoadedCount(completedCount);
        };

        const loadFile = (index: number) => {
            return new Promise<void>((resolve) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', resources[index].url);
                xhr.responseType = 'blob';

                xhr.onprogress = (event) => {
                    if (event.lengthComputable) {
                        resources[index].total = event.total;
                        resources[index].loaded = event.loaded;
                        updateProgress();
                    }
                };

                xhr.onload = () => {
                    resources[index].done = true;
                    // If total was never set (no content-length), set it to loaded size or just mark done
                    if (resources[index].total === 0 && xhr.response) {
                        resources[index].total = xhr.response.size;
                        resources[index].loaded = xhr.response.size;
                    } else if (resources[index].total > 0) {
                        resources[index].loaded = resources[index].total;
                    }
                    updateProgress();
                    resolve();
                };

                xhr.onerror = () => {
                    console.error(`Failed to load ${resources[index].url}`);
                    resources[index].done = true; // Mark done to continue
                    updateProgress();
                    resolve();
                };

                xhr.send();
            });
        };

        Promise.all(assets.map((_, i) => loadFile(i))).then(() => {
            if (isMounted) onComplete();
        });

        return () => {
            isMounted = false;
        };
    }, [assets, onComplete]);

    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#1a1a1a]">
            {/* Background elements to match theme */}
            <div className="absolute inset-0 bg-[url('/fantasy-bg.jpg')] opacity-20 bg-cover bg-center" />

            <div className="relative z-10 flex flex-col items-center gap-6 p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-amber-900/30 w-[90%] max-w-md">
                <h2 className="text-2xl font-fantasy text-amber-500 animate-pulse text-shadow">
                    Summoning Assets...
                </h2>

                <div className="w-full h-4 bg-gray-900/80 rounded-full overflow-hidden border border-amber-900/50 box-shadow-fantasy">
                    <motion.div
                        className="h-full bg-gradient-to-r from-amber-800 via-amber-600 to-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "tween", ease: "linear", duration: 0.2 }}
                    />
                </div>

                <div className="flex justify-between w-full text-xs text-amber-200/60 font-fantasy tracking-widest">
                    <span>Checking Fates... ({loadedCount}/{assets.length})</span>
                    <span>{progress}%</span>
                </div>
            </div>
        </div>
    );
};
