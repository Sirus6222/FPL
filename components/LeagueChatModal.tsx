import React, { useState } from 'react';
import { X, Send, Smile } from 'lucide-react';
import { ChatMessage, League } from '../types';
import { MOCK_CHAT_MESSAGES } from '../constants';

interface LeagueChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League | null;
}

const LeagueChatModal: React.FC<LeagueChatModalProps> = ({ isOpen, onClose, league }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');

  if (!isOpen || !league) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user_name: 'You',
        message: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_me: true
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
        <div className="bg-white w-full max-w-sm h-[600px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="bg-pl-purple p-4 flex justify-between items-center text-white">
                <div>
                    <h3 className="font-bold">{league.name}</h3>
                    <div className="text-xs opacity-70 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        12 Online • Trash Talk Wall
                    </div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
                <div className="text-center text-[10px] text-gray-400 my-2">Today</div>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.is_me ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!msg.is_me && (
                            <img src={msg.avatar || `https://ui-avatars.com/api/?name=${msg.user_name}&background=random`} alt={msg.user_name} className="w-8 h-8 rounded-full border border-gray-200" />
                        )}
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm text-sm ${msg.is_me ? 'bg-pl-purple text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                            {!msg.is_me && <div className="text-[10px] font-bold text-pl-pink mb-0.5">{msg.user_name}</div>}
                            {msg.message}
                            <div className={`text-[9px] mt-1 text-right ${msg.is_me ? 'text-white/60' : 'text-gray-400'}`}>{msg.timestamp}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                <button className="text-gray-400 hover:text-gray-600 p-2">
                    <Smile size={20} />
                </button>
                <input 
                    type="text" 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..." 
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-purple/50"
                />
                <button 
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="bg-pl-purple text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default LeagueChatModal;