import React, { useState } from 'react';
import { ClozePassage } from '../types';
import { BookOpen, Check, Layout, AlertCircle } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';

interface GameLevel3Props {
  passage: ClozePassage;
  onComplete: (score: number, total: number) => void;
}

export const GameLevel3: React.FC<GameLevel3Props> = ({ passage, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({}); // blankId -> selectedOption
  const [submitted, setSubmitted] = useState(false);
  const [activeBlank, setActiveBlank] = useState<string | null>(null);

  const totalBlanks = passage.blanks.length;

  const handleSelect = (blankId: string, option: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [blankId]: option }));
    setActiveBlank(null); // Close selection
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setActiveBlank(null);
  };

  const handleFinish = () => {
    let score = 0;
    passage.blanks.forEach(blank => {
      if (answers[blank.id] === blank.correctAnswer) {
        score++;
      }
    });
    onComplete(score, totalBlanks);
  };

  // Helper to construct full text for TTS
  const getFullTextForSpeech = () => {
    let text = "";
    for (let i = 0; i < passage.textSegments.length; i++) {
        text += passage.textSegments[i];
        if (i < passage.blanks.length) {
            // Read the answer if provided, otherwise "blank"
            const blankId = passage.blanks[i].id;
            text += answers[blankId] ? ` ${answers[blankId]} ` : " blank ";
        }
    }
    return text;
  };

  // Helper to render the text with interactive blanks
  const renderPassage = () => {
    const elements = [];
    
    for (let i = 0; i < passage.textSegments.length; i++) {
        // Add text segment
        elements.push(
            <span key={`seg-${i}`} className="leading-loose text-gray-700">{passage.textSegments[i]}</span>
        );

        // Add blank if it exists for this index
        if (i < passage.blanks.length) {
            const blank = passage.blanks[i];
            const hasAnswer = !!answers[blank.id];
            const isCorrect = submitted && answers[blank.id] === blank.correctAnswer;
            const isActive = activeBlank === blank.id;

            let badgeClass = "inline-flex items-center justify-center min-w-[100px] h-8 mx-1 px-3 align-middle rounded-lg font-bold cursor-pointer transition-all duration-200 select-none text-sm ";
            
            if (submitted) {
                 if (isCorrect) badgeClass += "bg-green-100 text-green-700 border border-green-300";
                 else badgeClass += "bg-red-100 text-red-700 border border-red-300 line-through decoration-red-500";
            } else {
                if (isActive) badgeClass += "bg-purple-600 text-white shadow-lg ring-2 ring-purple-200 transform scale-105";
                else if (hasAnswer) badgeClass += "bg-purple-100 text-purple-900 border border-purple-200 hover:bg-purple-200";
                else badgeClass += "bg-gray-100 text-gray-400 border border-gray-200 border-dashed hover:border-purple-400 hover:text-purple-400";
            }

            elements.push(
                <span 
                    key={blank.id}
                    onClick={() => !submitted && setActiveBlank(isActive ? null : blank.id)}
                    className={badgeClass}
                >
                    {submitted && !isCorrect ? `${answers[blank.id]} (${blank.correctAnswer})` : (answers[blank.id] || `[ ${i + 1} ]`)}
                </span>
            );
        }
    }
    return elements;
  };

  const currentBlankData = activeBlank ? passage.blanks.find(b => b.id === activeBlank) : null;
  const progress = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col gap-4">
      {/* Top Info Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-gray-100">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
                <h2 className="font-bold text-gray-800 hidden md:block">{passage.title || "Cloze Test"}</h2>
                <div className="flex items-center gap-2 md:hidden">
                    <span className="font-bold text-gray-800">Cloze Test</span>
                </div>
            </div>
            <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
            <SpeakerButton text={getFullTextForSpeech()} label="Read Passage" size="sm" />
         </div>
         <div className="flex items-center gap-2">
            <div className="text-right mr-2 hidden sm:block">
                <span className="text-xs text-gray-400 uppercase font-bold">Progress</span>
                <div className="text-purple-600 font-bold">{progress} / {totalBlanks}</div>
            </div>
            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-purple-500 transition-all duration-300" 
                    style={{width: `${(progress/totalBlanks)*100}%`}}
                />
            </div>
         </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="prose prose-lg max-w-none text-justify">
                <p>{renderPassage()}</p>
            </div>
        </div>
        
        {/* Helper Overlay for selecting words */}
        <div className={`border-t border-gray-100 bg-gray-50/80 backdrop-blur-md p-6 transition-all duration-300 ${currentBlankData ? 'translate-y-0' : 'translate-y-0'}`}>
             {!submitted && !currentBlankData && (
                 <div className="text-center text-gray-400 py-4 flex flex-col items-center gap-2">
                    <Layout className="w-8 h-8 opacity-20" />
                    <p>Tap on a blank space specifically like <span className="inline-block bg-gray-200 text-gray-500 text-xs px-1 rounded">[ 1 ]</span> to see options.</p>
                 </div>
             )}

             {currentBlankData && !submitted && (
                 <div className="animate-fade-in-up">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-purple-900 uppercase tracking-wider">
                            Options for blank #{passage.blanks.findIndex(b=>b.id===activeBlank) + 1}
                        </span>
                        <button onClick={() => setActiveBlank(null)} className="text-gray-400 hover:text-gray-600">
                            <AlertCircle className="w-5 h-5" />
                        </button>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {currentBlankData.options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleSelect(currentBlankData.id, opt)}
                                className="bg-white border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 py-3 px-2 rounded-xl shadow-sm transition-all font-semibold text-gray-700 text-center"
                            >
                                {opt}
                            </button>
                        ))}
                     </div>
                 </div>
             )}

             {submitted && (
                <div className="flex justify-center py-4">
                     <button
                        onClick={handleFinish}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-purple-200 transform hover:scale-105 flex items-center gap-2"
                    >
                        View ScoreBoard <Check className="w-5 h-5" />
                    </button>
                </div>
             )}

             {!submitted && Object.keys(answers).length === totalBlanks && !currentBlankData && (
                 <div className="flex justify-center py-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-3 rounded-full font-bold shadow-lg shadow-purple-200 transform hover:scale-105 transition-all"
                    >
                        Submit Answers
                    </button>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};