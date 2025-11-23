import React, { useState } from 'react';
import { WordMatchQuestion } from '../types';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';

interface GameLevel1Props {
  questions: WordMatchQuestion[];
  onComplete: (score: number, total: number) => void;
}

export const GameLevel1: React.FC<GameLevel1Props> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIndex];

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(score + (selectedOption === currentQ.correctAnswer ? 0 : 0), questions.length); // Score is already updated
    }
  };

  const getButtonClass = (option: string) => {
    const base = "w-full p-5 text-left rounded-xl border-2 transition-all duration-200 font-medium text-lg relative overflow-hidden ";
    if (!isAnswered) {
      return base + "bg-white border-gray-100 hover:border-indigo-400 hover:shadow-md text-gray-700";
    }
    if (option === currentQ.correctAnswer) {
      return base + "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm";
    }
    if (option === selectedOption && option !== currentQ.correctAnswer) {
      return base + "bg-red-50 border-red-500 text-red-800 opacity-75";
    }
    return base + "bg-gray-50 border-transparent text-gray-400 opacity-50";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <span className="text-gray-500 font-medium text-sm tracking-wide">QUESTION {currentIndex + 1} / {questions.length}</span>
        <div className="flex items-center gap-4">
             <div className="text-right">
                <span className="block text-xs text-gray-400 uppercase">Score</span>
                <span className="font-bold text-indigo-600">{score * 10} pts</span>
             </div>
            <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-10 mb-6 text-center border border-gray-100 relative">
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Select the Chinese Definition</h2>
        
        <div className="flex items-center justify-center gap-4 mb-2">
            <div className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight">{currentQ.word}</div>
            <SpeakerButton text={currentQ.word} size="lg" className="bg-indigo-50" />
        </div>
        
        <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full mb-8"></div>
        
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={getButtonClass(option)}
              disabled={isAnswered}
            >
              <div className="flex items-center justify-between relative z-10">
                <span>{option}</span>
                {isAnswered && option === currentQ.correctAnswer && <CheckCircle className="w-6 h-6 text-emerald-600"/>}
                {isAnswered && option === selectedOption && option !== currentQ.correctAnswer && <XCircle className="w-6 h-6 text-red-600"/>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-16 flex justify-end">
        {isAnswered && (
            <button
            onClick={handleNext}
            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-200 transition-all transform hover:scale-105"
            >
            {currentIndex === questions.length - 1 ? "Finish" : "Next"} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        )}
      </div>
    </div>
  );
};