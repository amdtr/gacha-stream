
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
    assets: string[];
    onComplete: () => void;
}

export const LoadingScreen = ({ assets, onComplete }: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);

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
            // Strategy: Assume equal weight? No, size matters.
            // Strategy: Sum the ones we know.

            const definedTotals = resources.reduce((acc, r) => acc + r.total, 0);
            const definedLoaded = resources.reduce((acc, r) => acc + r.loaded, 0);

            // If we have no totals yet, progress is 0.
            // If we have some, we use what we have.

            // Fallback for when Total is 0 (e.g. gzip or chunked without content-length)
            // If local dev, content-length might be missing.
            // We can track "files completed" as a baseline.
            const filesCompleted = resources.filter(r => r.done).length;
            const fileProgress = (filesCompleted / resources.length) * 100;

            if (definedTotals > 0) {
                const byteProgress = (definedLoaded / definedTotals) * 100;
                // Average them? or trust bytes? Trust bytes if significant.
                setProgress(Math.round(byteProgress));
            } else {
                setProgress(Math.round(fileProgress));
            }
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
                    // If total was never set (no content-length), set it to loaded size
                    if (resources[index].total === 0) {
                        resources[index].total = xhr.response.size;
                        resources[index].loaded = xhr.response.size;
                    } else {
                        resources[index].loaded = resources[index].total; // Ensure 100%
                    }
                    updateProgress();
                    resolve();
                };

                xhr.onerror = () => {
                    console.error(`Failed to load ${resources[index].url}`);
                    resources[index].done = true; // Mark done to continue
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
                    <span>Loading...</span>
                    <span>{progress}%</span>
                </div>
            </div>
        </div>
    );
};
