import React, { useState } from 'react';
import { SentenceQuestion } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';

interface GameLevel2Props {
  questions: SentenceQuestion[];
  onComplete: (score: number, total: number) => void;
}

export const GameLevel2: React.FC<GameLevel2Props> = ({ questions, onComplete }) => {
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
      onComplete(score, questions.length);
    }
  };

  const getButtonClass = (option: string) => {
    const base = "w-full p-4 text-center rounded-xl border-2 transition-all duration-200 font-bold text-lg ";
    if (!isAnswered) {
      return base + "bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700";
    }
    if (option === currentQ.correctAnswer) {
      return base + "bg-green-100 border-green-500 text-green-800";
    }
    if (option === selectedOption && option !== currentQ.correctAnswer) {
      return base + "bg-red-100 border-red-500 text-red-800";
    }
    return base + "bg-gray-50 border-gray-200 text-gray-400";
  };

  // Construct sentence for TTS: Replace the visual blank with the spoken word "blank" or the answer if answered
  const getSpeakableText = () => {
    const filler = isAnswered && selectedOption ? selectedOption : "blank";
    return `${currentQ.sentenceParts[0]} ${filler} ${currentQ.sentenceParts[1]}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-gray-500 font-medium">Question {currentIndex + 1} / {questions.length}</span>
        <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100">
         <div className="flex justify-between items-start mb-6">
            <h2 className="text-gray-400 text-xs uppercase tracking-wider font-bold text-center">Complete the sentence</h2>
            <SpeakerButton text={getSpeakableText()} />
         </div>
        
        <div className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed text-center mb-8">
          <span>{currentQ.sentenceParts[0]}</span>
          <span className={`inline-block min-w-[80px] border-b-2 px-2 mx-1 transition-colors ${
            isAnswered 
              ? selectedOption === currentQ.correctAnswer ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
              : 'border-blue-600 text-blue-600'
          }`}>
             {isAnswered ? selectedOption : "____"}
          </span>
          <span>{currentQ.sentenceParts[1]}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={getButtonClass(option)}
              disabled={isAnswered}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {isAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
             {currentIndex === questions.length - 1 ? "See Results" : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
};