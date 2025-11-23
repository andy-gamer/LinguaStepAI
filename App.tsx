import React, { useState, useEffect } from 'react';
import { GameMode, LevelConfig, WordMatchQuestion, SentenceQuestion, ClozePassage } from './types';
import { generateWordMatchQuestions, generateSentenceQuestions, generateClozeTest } from './services/geminiService';
import { LevelCard } from './components/LevelCard';
import { GameLevel1 } from './components/GameLevel1';
import { GameLevel2 } from './components/GameLevel2';
import { GameLevel3 } from './components/GameLevel3';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Trophy, RefreshCcw, Home, BrainCircuit, LockKeyhole } from 'lucide-react';

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    mode: GameMode.WORD_MATCH,
    title: "Vocab Definitions",
    description: "Select the correct Traditional Chinese meaning for the English word.",
    passingScore: 90,
    locked: false,
    color: 'indigo'
  },
  {
    id: 2,
    mode: GameMode.SENTENCE_COMPLETION,
    title: "Sentence Builder",
    description: "Choose the correct word to complete the sentence context.",
    passingScore: 90,
    locked: true,
    color: 'blue'
  },
  {
    id: 3,
    mode: GameMode.CLOZE_TEST,
    title: "Cloze Master",
    description: "Fill in multiple blanks within a complete paragraph.",
    passingScore: 90,
    locked: true,
    color: 'purple'
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'playing' | 'result'>('menu');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  
  // Game Data
  const [loading, setLoading] = useState(false);
  const [level1Data, setLevel1Data] = useState<WordMatchQuestion[]>([]);
  const [level2Data, setLevel2Data] = useState<SentenceQuestion[]>([]);
  const [level3Data, setLevel3Data] = useState<ClozePassage | null>(null);

  // Result Data
  const [lastScore, setLastScore] = useState(0);
  const [lastTotal, setLastTotal] = useState(0);

  const currentLevelConfig = LEVELS.find(l => l.id === selectedLevelId) || LEVELS[0];

  const handleLevelSelect = async (id: number) => {
    setSelectedLevelId(id);
    setLoading(true);
    setCurrentView('playing');
    
    // Reset data
    setLevel1Data([]);
    setLevel2Data([]);
    setLevel3Data(null);

    try {
      if (id === 1) {
        // Generate 10 questions to ensure 90% is calculated comfortably (9/10)
        const data = await generateWordMatchQuestions(10); 
        setLevel1Data(data);
      } else if (id === 2) {
        const data = await generateSentenceQuestions(10);
        setLevel2Data(data);
      } else if (id === 3) {
        const data = await generateClozeTest();
        setLevel3Data(data);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate questions. Please check your network or API Key.");
      setCurrentView('menu');
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = (score: number, total: number) => {
    setLastScore(score);
    setLastTotal(total);
    setCurrentView('result');

    const percentage = (score / total) * 100;
    if (percentage >= currentLevelConfig.passingScore) {
      const nextLevelId = selectedLevelId + 1;
      if (nextLevelId <= 3 && !unlockedLevels.includes(nextLevelId)) {
        setUnlockedLevels(prev => [...prev, nextLevelId]);
      }
    }
  };

  const renderGame = () => {
    if (loading) return <LoadingSpinner />;

    switch (selectedLevelId) {
      case 1:
        return level1Data.length > 0 ? <GameLevel1 questions={level1Data} onComplete={handleGameComplete} /> : <div>No Data</div>;
      case 2:
        return level2Data.length > 0 ? <GameLevel2 questions={level2Data} onComplete={handleGameComplete} /> : <div>No Data</div>;
      case 3:
        return level3Data ? <GameLevel3 passage={level3Data} onComplete={handleGameComplete} /> : <div>No Data</div>;
      default:
        return <div>Unknown Level</div>;
    }
  };

  const renderResult = () => {
    const percentage = Math.round((lastScore / lastTotal) * 100);
    const passed = percentage >= currentLevelConfig.passingScore;

    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in-up">
        <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {passed ? <Trophy className="w-12 h-12" /> : <LockKeyhole className="w-12 h-12" />}
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{passed ? "Challenge Passed!" : "Try Again"}</h2>
        
        <div className="flex justify-center items-end gap-2 mb-2">
            <span className={`text-5xl font-extrabold ${passed ? 'text-green-600' : 'text-red-500'}`}>{percentage}%</span>
            <span className="text-gray-400 font-medium mb-2">Accuracy</span>
        </div>
        
        <p className="text-gray-500 mb-8">
          You scored {lastScore} out of {lastTotal}.<br/>
          {!passed && `You need ${currentLevelConfig.passingScore}% to unlock the next level.`}
        </p>

        {passed && selectedLevelId < 3 && !unlockedLevels.includes(selectedLevelId + 1) && (
            <div className="mb-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-800 text-sm font-semibold animate-bounce">
                🎉 Level {selectedLevelId + 1} Unlocked!
            </div>
        )}

        <div className="space-y-3">
          <button 
            onClick={() => handleLevelSelect(selectedLevelId)}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <RefreshCcw className="w-5 h-5" /> Retry Level
          </button>
          
          <button 
            onClick={() => setCurrentView('menu')}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" /> Back to Menu
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md">
               <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">
              LinguaStep AI
            </h1>
          </div>
          {currentView !== 'menu' && (
             <div className="text-sm font-semibold text-gray-500">
                Level {selectedLevelId}: {currentLevelConfig.title}
             </div>
          )}
        </div>
      </header>

      <main className="p-6">
        {currentView === 'menu' && (
          <div className="max-w-5xl mx-auto py-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Master English Vocabulary</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Complete each stage with <span className="text-indigo-600 font-bold">90% accuracy</span> to unlock the next challenge.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {LEVELS.map(level => (
                <LevelCard 
                  key={level.id} 
                  config={{...level, locked: !unlockedLevels.includes(level.id)}} 
                  onSelect={handleLevelSelect} 
                />
              ))}
            </div>
          </div>
        )}

        {currentView === 'playing' && (
          <div className="container mx-auto max-w-4xl pt-4">
             <button 
                onClick={() => setCurrentView('menu')}
                className="mb-6 text-gray-400 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium transition-colors"
            >
                <Home className="w-4 h-4" /> Quit to Menu
            </button>
            {renderGame()}
          </div>
        )}

        {currentView === 'result' && (
          <div className="container mx-auto pt-10">
            {renderResult()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
