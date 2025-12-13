import React from 'react';
import bgVideo from '../../assets/bg.mp4';

export const GameLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-[#1a1a1a] text-[#d7ccc8] font-fantasy selection:bg-amber-700 w-screen h-screen overflow-hidden relative flex flex-col">
            {/* Visual Background */}
            <div className="fixed inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={bgVideo} type="video/mp4" />
                </video>
            </div>
            {/* Overlay removed per user request */}

            {/* Content wrapper */}
            <div className="relative z-10 w-full h-full flex flex-col p-6">
                {children}
            </div>
        </div>
    );
};
