export type SoundEffectType = 'pull' | 'meteor' | 'impact' | 'reveal' | 'rare' | 'common' | 'click' | 'open_all';

export const playSound = (type: SoundEffectType) => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const createOsc = (type: OscillatorType, freq: number, startTime: number, duration: number, volStart: number, volEnd: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(volStart, startTime);
        gain.gain.exponentialRampToValueAtTime(volEnd, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
        return { osc, gain };
    };

    switch (type) {
        case 'click':
            createOsc('sine', 800, now, 0.1, 0.2, 0.01);
            break;

        case 'pull':
            // "Grand" start: Deep rumble + rising sparkle
            // Low rumble
            const oscLow = ctx.createOscillator();
            const gainLow = ctx.createGain();
            oscLow.connect(gainLow);
            gainLow.connect(ctx.destination);
            oscLow.type = 'sawtooth';
            oscLow.frequency.setValueAtTime(50, now);
            oscLow.frequency.linearRampToValueAtTime(100, now + 1.5);
            gainLow.gain.setValueAtTime(0.2, now);
            gainLow.gain.linearRampToValueAtTime(0, now + 1.5);
            oscLow.start(now);
            oscLow.stop(now + 1.5);

            // Rising sparkles
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createOsc('sine', 400 + i * 200, ctx.currentTime, 0.3, 0.1, 0.01);
                }, i * 200);
            }
            break;

        case 'meteor':
            // Intense traveling whoosh
            const oscTravel = ctx.createOscillator();
            const gainTravel = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            oscTravel.connect(filter);
            filter.connect(gainTravel);
            gainTravel.connect(ctx.destination);

            oscTravel.type = 'sawtooth';
            oscTravel.frequency.value = 100;

            // Filter sweep to simulate passing by
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, now);
            filter.frequency.exponentialRampToValueAtTime(2000, now + 3); // Sweep up

            gainTravel.gain.setValueAtTime(0, now);
            gainTravel.gain.linearRampToValueAtTime(0.3, now + 1.5);
            gainTravel.gain.linearRampToValueAtTime(0, now + 3.0);

            oscTravel.start(now);
            oscTravel.stop(now + 3.0);
            break;

        case 'impact':
            // BIG EXPLOSION: White noise burst + low thud
            const bufferSize = ctx.sampleRate * 2; // 2 seconds
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = ctx.createGain();
            noise.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noiseGain.gain.setValueAtTime(0.8, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
            noise.start(now);

            // Sub click
            createOsc('square', 50, now, 0.5, 0.5, 0.01);
            break;

        case 'reveal':
            // Sharp, crisp flip sound
            createOsc('sine', 1500, now, 0.1, 0.2, 0.01);
            createOsc('triangle', 500, now, 0.15, 0.2, 0.01);
            break;

        case 'rare':
            // "Grand" Fanfare: Major Chord
            const chord = [523.25, 659.25, 783.99, 1046.50]; // C E G C
            chord.forEach((freq, i) => {
                const t = now + i * 0.05;
                // Main tone
                createOsc('triangle', freq, t, 1.5, 0.2, 0.01);
                // Harmonics
                createOsc('sine', freq * 2, t, 1.5, 0.1, 0.01);
            });
            break;

        case 'open_all':
            // Rapid succession of potential sounds
            const sweep = ctx.createOscillator();
            const sweepGain = ctx.createGain();
            sweep.connect(sweepGain);
            sweepGain.connect(ctx.destination);
            sweep.frequency.setValueAtTime(400, now);
            sweep.frequency.exponentialRampToValueAtTime(1200, now + 0.5);
            sweepGain.gain.setValueAtTime(0.3, now);
            sweepGain.gain.linearRampToValueAtTime(0, now + 0.5);
            sweep.start(now);
            sweep.stop(now + 0.5);
            break;

        case 'common':
            createOsc('triangle', 300, now, 0.2, 0.1, 0.01);
            break;
    }
};
