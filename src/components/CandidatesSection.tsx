import React from 'react';
import { useElection } from '../context/ElectionContext';
import { Candidate, MAX_TOTAL_VOTES } from '../types';
import { 
  Vote, 
  CheckCircle2, 
  FileText, 
  Award, 
  ExternalLink, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface CandidatesSectionProps {
  onSelectCandidateToVote: (candidateId: string) => void;
  onOpenManifestoModal: (candidateId?: string) => void;
}

export const CandidatesSection: React.FC<CandidatesSectionProps> = ({
  onSelectCandidateToVote,
  onOpenManifestoModal
}) => {
  const { candidates, totalVotes, isCompleted, isPaused } = useElection();

  return (
    <section id="candidates" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-3 text-[10px] uppercase font-bold text-emerald-400 tracking-[0.2em]">
            <Award className="w-3.5 h-3.5" />
            <span>Official Ballot</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            Meet the <span className="font-bold text-emerald-400 italic">Candidates</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Review their academic agendas, manifestos, and vision for the Bano Qabil 3.0 batch.
          </p>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {candidates.map((candidate: Candidate, index: number) => {
            const votePercent = totalVotes > 0 
              ? Math.round((candidate.votes / totalVotes) * 100) 
              : 0;

            const isLeading = totalVotes > 0 && candidate.votes > (candidates[index === 0 ? 1 : 0]?.votes || 0);

            return (
              <div 
                key={candidate.id}
                id={`candidate-card-${candidate.id}`}
                className="relative group bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-2xl flex flex-col justify-between"
              >
                {/* Watermark Index Number */}
                <div className="absolute top-4 right-6 opacity-10 text-6xl font-black italic select-none text-white pointer-events-none">
                  0{index + 1}
                </div>

                {/* Candidate Content Body */}
                <div>
                  <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b border-white/5">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-800 border-2 border-emerald-500/30 flex-shrink-0 overflow-hidden relative shadow-lg">
                      <img 
                        src={candidate.photoUrl} 
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-emerald-400 font-mono text-[10px] font-bold border border-white/10">
                        C-0{index + 1}
                      </span>
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-h-[120px]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold text-white tracking-tight">
                            {candidate.name}
                          </h3>
                          {isLeading && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                              <TrendingUp className="w-3 h-3" /> Leading
                            </span>
                          )}
                        </div>
                        <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">
                          {candidate.track}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {candidate.rollNumber} • {candidate.batch}
                        </p>
                      </div>

                      <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                          {candidate.votes}
                        </span>
                        <span className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                          VOTES ({votePercent}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Tagline */}
                  <div className="mt-5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-300 text-xs font-medium italic">
                    "{candidate.tagline}"
                  </div>

                  {/* Bio */}
                  <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {candidate.bio}
                  </p>

                  {/* Key Manifesto Highlights */}
                  <div className="mt-5">
                    <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Key Priorities & Action Points
                    </h4>
                    <ul className="space-y-2">
                      {candidate.manifestoPoints.slice(0, 3).map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills & Focus Tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {candidate.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="px-2.5 py-1 rounded bg-white/5 text-slate-300 text-[11px] font-medium border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => onSelectCandidateToVote(candidate.id)}
                    disabled={isCompleted || isPaused}
                    className={`w-full sm:flex-1 py-4 font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 ${
                      isCompleted
                        ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                        : isPaused
                          ? 'bg-amber-900/40 text-amber-300 cursor-not-allowed border border-amber-700/40'
                          : 'bg-white text-black hover:bg-emerald-400 shadow-white/5 active:scale-[0.99]'
                    }`}
                    id={`vote-btn-${candidate.id}`}
                  >
                    <Vote className="w-4 h-4" />
                    <span>
                      {isCompleted 
                        ? 'Election Closed' 
                        : isPaused 
                          ? 'Voting Paused' 
                          : `Cast Vote for Candidate 0${index + 1}`
                      }
                    </span>
                  </button>

                  <button
                    onClick={() => onOpenManifestoModal(candidate.id)}
                    className="w-full sm:w-auto px-5 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs uppercase tracking-widest font-bold border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                    id={`manifesto-btn-${candidate.id}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Manifesto</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
