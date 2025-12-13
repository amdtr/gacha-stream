import React from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import { GameLayout } from './components/layout/GameLayout';
import { Header } from './components/ui/Header';
import { SetupScreen } from './components/game/SetupScreen';
import { HistorySidebar } from './components/game/HistorySidebar';
import { ResultsGrid } from './components/game/ResultsGrid';
import { Controls } from './components/game/Controls';
import { MeteorAnimation } from './components/effects/MeteorAnimation';

// Hooks
import { useGachaGame } from './hooks/useGachaGame';
import { useAudio } from './hooks/useAudio';

export default function GachaSimulator() {
  const game = useGachaGame();
  const audio = useAudio(game.isWishing);

  return (
    <GameLayout>
      {/* Visual FX Layer */}
      <AnimatePresence>
        {game.meteorConfig.show && (
          <MeteorAnimation
            onComplete={game.onMeteorComplete}
            results={game.currentPullResults}
          />
        )}
      </AnimatePresence>

      <Header
        bgmEnabled={audio.bgmEnabled}
        toggleBgm={audio.toggleBgm}
        gameStarted={game.gameStarted}
        itemCount={game.items.length}
        pityCount={game.pityCount}
        maxPity={game.maxPity}
        onReset={game.resetGame}
      />

      {!game.gameStarted ? (
        <SetupScreen
          inputValue={game.inputValue}
          setInputValue={game.setInputValue}
          maxPity={game.maxPity}
          setMaxPity={game.setMaxPity}
          allowRepeatedElimination={game.allowRepeatedElimination}
          setAllowRepeatedElimination={game.setAllowRepeatedElimination}
          onStart={game.handleStart}
        />
      ) : (
        <div className="flex-1 flex gap-8 min-h-0 relative">

          <HistorySidebar
            eliminatedItems={game.eliminatedItems}
          />

          <ResultsGrid
            isWishing={game.isWishing}
            isRevealing={game.isRevealing}
            results={game.currentPullResults}
            revealedIndices={game.revealedIndices}
            revealCard={game.revealCard}
            skipReveal={game.skipReveal}
            closeReveal={game.closeReveal}
          />

          <Controls
            poolSize={game.items.length}
            performPull={game.performPull}
            disabled={game.isWishing || game.isRevealing}
          />

        </div>
      )}
    </GameLayout>
  );
}