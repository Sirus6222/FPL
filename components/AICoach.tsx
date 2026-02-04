
import React, { useState } from 'react';
import { Sparkles, Send, Bot } from 'lucide-react';
import { generateTransferAdvice } from '../services/geminiService';
import { Player } from '../types';
import ReactMarkdown from 'react-markdown';

interface AICoachProps {
  squad: Player[];
  bank: number;
}

const AICoach: React.FC<AICoachProps> = ({ squad, bank }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    setLoading(true);
    setAdvice(null);
    const result = await generateTransferAdvice(squad, bank, 1);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-pl-purple to-[#2A0F45] rounded-xl p-4 text-white shadow-lg border border-pl-pink/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white/10 p-2 rounded-full">
          <Sparkles className="text-pl-green w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg">AI Assistant Coach</h3>
          <p className="text-xs text-white/60">Powered by Gemini</p>
        </div>
      </div>

      {!advice && !loading && (
        <div className="text-center py-4">
          <p className="text-sm text-white/80 mb-4">
            Need help with your transfers? I can analyze your squad, form, and fixture difficulty to suggest the best moves.
          </p>
          <button 
            onClick={handleAskAI}
            className="bg-white text-pl-purple font-bold py-2 px-6 rounded-full shadow-lg hover:bg-pl-green hover:text-pl-purple transition flex items-center gap-2 mx-auto"
          >
            <Bot size={18} />
            Analyze My Team
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <LoaderSpinner />
          <p className="text-sm animate-pulse text-pl-green">Analyzing fixture difficulty...</p>
        </div>
      )}

      {advice && (
        <div className="bg-black/20 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="prose prose-invert prose-sm max-w-none text-sm text-white/90">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>
          <button 
            onClick={() => setAdvice(null)}
            className="mt-4 text-xs text-pl-green hover:underline w-full text-center"
          >
            Ask Again
          </button>
        </div>
      )}
    </div>
  );
};

const LoaderSpinner = () => (
  <svg className="animate-spin h-8 w-8 text-pl-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default AICoach;
