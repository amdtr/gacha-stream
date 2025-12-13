
import { useState, useEffect, useRef } from 'react';
import { playSound as playSfx, type SoundEffectType } from '../utils/sound';

export const useAudio = (isWishing: boolean) => {
    const [bgmEnabled, setBgmEnabled] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize Audio
        audioRef.current = new Audio('/fantasy-bgm.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Control BGM playback
    useEffect(() => {
        if (!audioRef.current) return;

        if (bgmEnabled && !isWishing) {
            // Should Play
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log("Audio play failed (interaction required):", error));
            }
        } else {
            // Should Pause (disabled or wishing)
            audioRef.current.pause();
        }
    }, [bgmEnabled, isWishing]);

    const toggleBgm = () => {
        setBgmEnabled(!bgmEnabled);
    };

    const playSound = (sound: SoundEffectType) => {
        playSfx(sound);
    };

    return { bgmEnabled, toggleBgm, playSound };
};


