import { useState } from 'react';
import type { CardData, CardType } from '../types';
import { playSound } from '../utils/sound';

const DEFAULT_MAX_PITY = 60;

export const useGachaGame = () => {
    const [items, setItems] = useState<string[]>([]);
    const [eliminatedItems, setEliminatedItems] = useState<import('../types').EliminatedItem[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [maxPity, setMaxPity] = useState(DEFAULT_MAX_PITY);
    const [allowRepeatedElimination, setAllowRepeatedElimination] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [pityCount, setPityCount] = useState(0);

    // Animation & Reveal State
    const [isWishing, setIsWishing] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);
    const [currentPullResults, setCurrentPullResults] = useState<CardData[]>([]);
    const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
    const [meteorConfig, setMeteorConfig] = useState<{ show: boolean }>({ show: false });

    const handleStart = () => {
        playSound('click');
        const list = inputValue.split('\n').map(l => l.trim()).filter(l => l !== '');
        if (list.length < 2) {
            alert("Please enter at least 2 items to start.");
            return;
        }
        setItems(list);
        setPityCount(0);
        setGameStarted(true);
    };

    const performPull = (pullCount: number) => {
        playSound('pull');
        if (items.length === 0) return;

        if (items.length === 1 && pullCount === 1) {
            const winner = items[0];
            const result: CardData = { id: Date.now().toString(), type: 'winner', content: winner };
            setItems([]);
            setEliminatedItems(prev => [...prev, { content: winner, type: 'winner' }]);
            launchAnimation([result]);
            return;
        }

        let tempItems = [...items];
        const results: CardData[] = [];
        let hasEliminationOrWinner = false;
        let simulatedPity = pityCount;

        for (let i = 0; i < pullCount; i++) {
            // CASE A: Pool Empty
            if (tempItems.length === 0) {
                results.push({ id: Math.random().toString(), type: 'normal', content: "Common Item" });
                simulatedPity++;
                continue;
            }

            simulatedPity++;
            const rand = Math.random();
            const softPityStart = Math.max(0, maxPity - 6);
            let winnerRate = 0.01;

            if (simulatedPity > softPityStart) {
                const progress = (simulatedPity - softPityStart) / (maxPity - softPityStart);
                winnerRate = 0.01 + (0.99 * progress);
            }

            let type: CardType = 'normal';
            let content = "Common Item";

            const eligibleWinners = tempItems.filter(item => !eliminatedItems.some(e => e.content === item));
            const canWin = eligibleWinners.length > 0;

            if (tempItems.length === 1) {
                if (canWin && (simulatedPity >= maxPity || rand < winnerRate)) {
                    type = 'winner';
                    content = eligibleWinners[0];
                    tempItems = [];
                    simulatedPity = 0;
                } else {
                    type = 'normal';
                }
            } else {
                if (canWin && (simulatedPity >= maxPity || rand < winnerRate)) {
                    type = 'winner';
                    const winIdxLocal = Math.floor(Math.random() * eligibleWinners.length);
                    content = eligibleWinners[winIdxLocal];
                    const realIdx = tempItems.indexOf(content);
                    if (realIdx > -1) tempItems.splice(realIdx, 1);
                    simulatedPity = 0;
                } else if (rand < (winnerRate + 0.08)) {
                    type = 'elimination';
                    const elIdx = Math.floor(Math.random() * tempItems.length);
                    content = tempItems[elIdx];
                    if (!allowRepeatedElimination) {
                        tempItems.splice(elIdx, 1);
                    }
                } else {
                    type = 'normal';
                }
            }

            results.push({ id: Math.random().toString(), type, content });
            if (type !== 'normal') hasEliminationOrWinner = true;
        }

        setPityCount(simulatedPity);

        if (pullCount === 6 && !hasEliminationOrWinner && tempItems.length > 1) {
            const elIdx = Math.floor(Math.random() * tempItems.length);
            const forcedContent = tempItems[elIdx];
            if (!allowRepeatedElimination) {
                tempItems.splice(elIdx, 1);
            }
            results[5] = { id: Math.random().toString(), type: 'elimination', content: forcedContent };
        }

        setItems(tempItems);
        launchAnimation(results);
    };

    const launchAnimation = (results: CardData[]) => {
        setIsWishing(true);
        setCurrentPullResults(results);
        setRevealedIndices([]);
        setMeteorConfig({ show: true });
    };

    const onMeteorComplete = () => {
        setMeteorConfig(prev => ({ ...prev, show: false }));
        setIsRevealing(true);
    };

    const revealCard = (index: number) => {
        if (revealedIndices.includes(index)) return;
        const card = currentPullResults[index];
        const soundType = card.type === 'winner' || card.type === 'elimination' ? 'rare' : 'reveal';
        playSound(soundType);
        setRevealedIndices(prev => [...prev, index]);

        if (card.type === 'elimination' || card.type === 'winner') {
            setEliminatedItems(prev => {
                const exists = prev.some(e => e.content === card.content);
                return exists ? prev : [...prev, { content: card.content, type: card.type as 'winner' | 'elimination' }];
            });
        }
    };

    const skipReveal = () => {
        playSound('open_all');
        const unrevealedEliminations = currentPullResults
            .filter((r, i) => !revealedIndices.includes(i) && (r.type === 'elimination' || r.type === 'winner'))
            .map(r => ({ content: r.content, type: r.type as 'winner' | 'elimination' }));

        if (unrevealedEliminations.length > 0) {
            setEliminatedItems(prev => {
                const newItems = unrevealedEliminations.filter(newItem => !prev.some(existing => existing.content === newItem.content));
                return [...prev, ...newItems];
            });
        }

        const allIndices = currentPullResults.map((_, i) => i);
        setRevealedIndices(allIndices);

        const hasGood = currentPullResults.some(r => r.type !== 'normal');
        if (hasGood) setTimeout(() => playSound('rare'), 300);
    };

    const closeReveal = () => {
        playSound('click');
        setIsWishing(false);
        setIsRevealing(false);
        setCurrentPullResults([]);
    };

    const resetGame = () => {
        playSound('click');
        setGameStarted(false);
        setItems([]);
        setEliminatedItems([]);
        setPityCount(0);
        setCurrentPullResults([]);
        setIsWishing(false);
        setIsRevealing(false);
    };

    return {
        items,
        eliminatedItems,
        inputValue,
        setInputValue,
        maxPity,
        setMaxPity,
        allowRepeatedElimination,
        setAllowRepeatedElimination,
        gameStarted,
        pityCount,
        isWishing,
        isRevealing,
        currentPullResults,
        revealedIndices,
        meteorConfig,
        handleStart,
        performPull,
        onMeteorComplete,
        revealCard,
        skipReveal,
        closeReveal,
        resetGame
    };
};
