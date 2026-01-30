
import React, { useState } from 'react';
import { X, Trophy, Users, Shield, MapPin, Building2, GraduationCap } from 'lucide-react';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, type: string) => void;
}

const CreateLeagueModal: React.FC<CreateLeagueModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [leagueName, setLeagueName] = useState('');
  const [leagueType, setLeagueType] = useState('private');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leagueName.trim()) {
        onCreate(leagueName, leagueType);
        setLeagueName('');
    }
  };

  const LeagueTypeButton = ({ type, label, subLabel, icon: Icon, active }: any) => (
      <button 
        type="button"
        onClick={() => setLeagueType(type)}
        className={`p-3 rounded-xl border-2 text-left transition relative overflow-hidden ${active ? 'border-pl-purple bg-purple-50' : 'border-gray-100 hover:border-gray-200'}`}
      >
          <div className="flex flex-col h-full justify-between relative z-10">
              <Icon className={`mb-2 ${active ? 'text-pl-purple' : 'text-gray-400'}`} size={20} />
              <div>
                  <div className="text-xs font-bold text-gray-800">{label}</div>
                  <div className="text-[10px] text-gray-500">{subLabel}</div>
              </div>
          </div>
      </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-pl-purple p-4 text-white flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><Trophy size={18} /> Create League</h3>
            <button onClick={onClose}><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">League Name</label>
                <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pl-purple outline-none"
                    placeholder="e.g. Addis Ballers"
                    value={leagueName}
                    onChange={e => setLeagueName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">League Type</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <LeagueTypeButton 
                        type="private" 
                        label="Classic" 
                        subLabel="Total points rank" 
                        icon={Users} 
                        active={leagueType === 'private'} 
                    />
                    <LeagueTypeButton 
                        type="h2h" 
                        label="Head-to-Head" 
                        subLabel="Weekly matches" 
                        icon={Shield} 
                        active={leagueType === 'h2h'} 
                    />
                </div>
                
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Local Community</div>
                <div className="grid grid-cols-3 gap-2">
                    <LeagueTypeButton 
                        type="city" 
                        label="City" 
                        subLabel="Location" 
                        icon={MapPin} 
                        active={leagueType === 'city'} 
                    />
                    <LeagueTypeButton 
                        type="company" 
                        label="Company" 
                        subLabel="Workplace" 
                        icon={Building2} 
                        active={leagueType === 'company'} 
                    />
                    <LeagueTypeButton 
                        type="university" 
                        label="Uni" 
                        subLabel="School" 
                        icon={GraduationCap} 
                        active={leagueType === 'university'} 
                    />
                </div>
            </div>

            <button type="submit" className="w-full bg-pl-green text-pl-purple font-bold py-3 rounded-xl hover:opacity-90 transition">
                Create League
            </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLeagueModal;
