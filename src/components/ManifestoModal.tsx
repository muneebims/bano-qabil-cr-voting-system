import React, { useState } from 'react';
import { useElection } from '../context/ElectionContext';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Vote, 
  BookOpen, 
  Award, 
  Users, 
  Target
} from 'lucide-react';

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCandidateId?: string;
  onSelectCandidateToVote?: (candidateId: string) => void;
}

export const ManifestoModal: React.FC<ManifestoModalProps> = ({
  isOpen,
  onClose,
  initialCandidateId,
  onSelectCandidateToVote
}) => {
  const { candidates, isCompleted, isPaused } = useElection();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    initialCandidateId || candidates[0]?.id || 'candidate-1'
  );

  if (!isOpen) return null;

  const currentCand = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] backdrop-blur-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Candidate <span className="text-emerald-400">Manifestos</span>
              </h3>
              <p className="text-xs text-slate-400">Compare campaign promises, goals & student initiatives</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            id="manifesto-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate Selector Tabs */}
        <div className="grid grid-cols-2 p-2 bg-black/40 border-b border-white/5 gap-2 shrink-0">
          {candidates.map(cand => {
            const isSelected = cand.id === currentCand?.id;
            return (
              <button
                key={cand.id}
                onClick={() => setSelectedCandidateId(cand.id)}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-white/10 text-white shadow-md border border-white/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                id={`manifesto-tab-${cand.id}`}
              >
                <img src={cand.photoUrl} alt={cand.name} className="w-6 h-6 rounded-full object-cover border border-white/10" />
                <span>{cand.name}</span>
                <span className="font-mono text-emerald-400 text-xs">({cand.votes} votes)</span>
              </button>
            );
          })}
        </div>

        {/* Manifesto Details Body */}
        {currentCand && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Candidate Bio Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-black/40 border border-white/5">
              <img 
                src={currentCand.photoUrl} 
                alt={currentCand.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400/40"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-bold text-white">{currentCand.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold tracking-widest border border-emerald-500/20">
                    {currentCand.rollNumber}
                  </span>
                </div>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">{currentCand.track}</p>
                <p className="text-xs text-slate-400 mt-1 italic">"{currentCand.tagline}"</p>
              </div>
            </div>

            {/* Leadership Vision */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Vision & Background
              </h5>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed p-4 rounded-xl bg-black/40 border border-white/5">
                {currentCand.bio}
              </p>
            </div>

            {/* Key Action Points */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Core Agenda & 5-Point Plan
              </h5>
              <div className="space-y-2.5">
                {currentCand.manifestoPoints.map((point, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Competencies */}
            <div>
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Skills & Strengths
              </h5>
              <div className="flex flex-wrap gap-2">
                {currentCand.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="px-3 py-1 rounded-lg bg-white/5 text-slate-300 text-xs font-mono border border-white/10">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Footer with Vote Action */}
        <div className="p-5 border-t border-white/5 bg-black/40 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider border border-white/10"
          >
            Close
          </button>

          {!isCompleted && !isPaused && onSelectCandidateToVote && currentCand && (
            <button
              onClick={() => {
                onClose();
                onSelectCandidateToVote(currentCand.id);
              }}
              className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-white/5 transition-all"
              id="manifesto-vote-direct-btn"
            >
              <Vote className="w-4 h-4" />
              <span>Vote for {currentCand.name.split(' ')[0]}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
