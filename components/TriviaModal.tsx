import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { TriviaQuestion } from '../types';

interface TriviaModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: TriviaQuestion[];
}

const TriviaModal: React.FC<TriviaModalProps> = ({ isOpen, onClose, questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks
    setSelectedOption(index);
    setShowResult(true);
    
    if (index === currentQuestion.correct_answer) {
        setScore(prev => prev + 1);
    }

    setTimeout(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowResult(false);
        } else {
            setIsFinished(true);
        }
    }, 1500);
  };

  const getOptionClass = (index: number) => {
    if (selectedOption === null) return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    if (index === currentQuestion.correct_answer) return "bg-green-100 border-green-500 text-green-700 font-bold";
    if (index === selectedOption) return "bg-red-100 border-red-500 text-red-700";
    return "bg-gray-50 border-gray-200 opacity-50";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden relative min-h-[400px] flex flex-col">
            
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                <X size={24} />
            </button>

            {!isFinished ? (
                <div className="flex-1 flex flex-col p-6">
                    <div className="text-center mb-6">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Daily Trivia</span>
                        <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-400 font-bold">Question {currentIndex + 1}/{questions.length}</div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 text-center mb-8">
                        {currentQuestion.question}
                    </h3>

                    <div className="space-y-3 flex-1">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(idx)}
                                disabled={selectedOption !== null}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${getOptionClass(idx)}`}
                            >
                                <span className="text-sm">{option}</span>
                                {showResult && idx === currentQuestion.correct_answer && <CheckCircle size={18} className="text-green-600" />}
                                {showResult && idx === selectedOption && idx !== currentQuestion.correct_answer && <XCircle size={18} className="text-red-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-white to-blue-50">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-500 animate-bounce">
                        <Trophy size={40} fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                    <p className="text-gray-500 mb-6">You scored <span className="font-bold text-blue-600">{score}/{questions.length}</span></p>
                    
                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm w-full mb-6">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Reward</div>
                        <div className="text-xl font-bold text-pl-purple">+{(score * 10) + 10} Coins</div>
                    </div>

                    <button onClick={onClose} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition">
                        Claim Reward
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default TriviaModal;