import React from 'react';
import { useElection } from '../context/ElectionContext';
import { 
  Vote, 
  ShieldCheck, 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

interface HeroProps {
  onOpenVoteModal: (candidateId?: string) => void;
  onOpenVerifyModal: () => void;
  onOpenManifestoModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenVoteModal,
  onOpenVerifyModal,
  onOpenManifestoModal
}) => {
  const { 
    totalVotes, 
    maxVotes,
    remainingVotes, 
    participationPercent, 
    isCompleted, 
    isPaused, 
    winnerResult,
    openWinnerModal,
    candidates
  } = useElection();

  const progressPercent = Math.min(100, Math.max(0, (totalVotes / (maxVotes || 1)) * 100));

  return (
    <section id="home" className="relative pt-12 pb-16 overflow-hidden">
      {/* Background Subtle Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Announcement / State Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="px-3.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4 inline-flex items-center gap-2 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-[0.2em]">
              Election Status: {isCompleted ? 'Closed' : isPaused ? 'Paused' : 'Active'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white">
            Choose Your <span className="font-bold text-emerald-400 italic">Representative</span>
          </h1>

          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            The election will automatically close upon reaching the {maxVotes}-vote limit. 
            One verified student ID, one secure cryptographic vote synced live across all devices.
          </p>
        </div>

        {/* Winner Banner if Election Completed */}
        {isCompleted && winnerResult && (
          <div className="max-w-4xl mx-auto mb-10 p-8 rounded-3xl bg-slate-900/40 border border-amber-500/30 shadow-2xl backdrop-blur-md text-center relative overflow-hidden">
            <div className="absolute top-4 right-6 opacity-10 text-7xl font-black italic select-none text-amber-400">
              WIN
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-[0.2em] font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Election Complete — {totalVotes} / {maxVotes} Votes Reached</span>
            </div>

            {winnerResult.isTie ? (
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Official Result: <span className="text-amber-400 italic">Historic Tie</span>
                </h2>
                <p className="mt-2 text-slate-300 text-sm max-w-xl mx-auto">
                  Both candidates received an equal share of votes. Both candidates will share council duties.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-amber-400">Elected Class Representative</p>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                  🎉 {winnerResult.winnerCandidate?.name}
                </h2>
                <p className="mt-2 text-slate-300 text-sm">
                  Won with <strong className="text-emerald-400 text-base">{winnerResult.winnerCandidate?.votes} Votes</strong> out of {totalVotes} total votes cast.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={openWinnerModal}
                className="px-6 py-3 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-xs shadow-xl shadow-white/5 hover:bg-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
                id="hero-view-winner-btn"
              >
                <Trophy className="w-4 h-4" />
                <span>View Winner Announcement</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Live Election Progress Card */}
        <div className="mt-6 max-w-4xl mx-auto bg-slate-900/40 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide uppercase text-xs">Live Vote Tally</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${
                  isCompleted 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : isPaused
                      ? 'bg-amber-900/30 text-amber-400 border border-amber-700/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {isCompleted ? 'COMPLETED' : isPaused ? 'PAUSED' : 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Real-time Firebase Firestore multi-device count</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                {totalVotes}
              </span>
              <span className="text-xl font-bold text-emerald-400 font-mono">
                / {maxVotes}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">
                Votes ({participationPercent}%)
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Progress to Election Cap</span>
              <span className="text-emerald-400 font-bold text-xs">{remainingVotes} Remaining Votes</span>
            </div>

            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div 
                className="h-full rounded-full bg-emerald-400 shadow-[0_0_10px_#00ff9c] transition-all duration-500 ease-out"
                style={{ width: `${Math.max(progressPercent, totalVotes > 0 ? 3 : 0)}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">
              <span>0 VOTES (START)</span>
              <span className="text-slate-400">{maxVotes} VOTE MAXIMUM</span>
            </div>
          </div>

          {/* Real-time Candidate Standings Preview */}
          <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {candidates.map((candidate, idx) => {
              const candPercent = totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0;
              return (
                <div 
                  key={candidate.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={candidate.photoUrl} 
                      alt={candidate.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">C-0{idx + 1}</span>
                        <h4 className="text-sm font-bold text-white">{candidate.name}</h4>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{candidate.track}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-white font-mono">{candidate.votes}</div>
                    <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">{candPercent}% of votes</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action CTAs inside Card */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-4">
            {!isCompleted && !isPaused ? (
              <button
                onClick={() => onOpenVoteModal()}
                className="px-8 py-3.5 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-xs shadow-xl shadow-white/5 hover:bg-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
                id="hero-cast-vote-cta"
              >
                <Vote className="w-4 h-4" />
                <span>Cast Your Vote Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            ) : isCompleted ? (
              <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs uppercase tracking-wider font-bold">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Election Closed — Maximum {maxVotes} Votes Reached</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-900/30 border border-amber-600/30 text-amber-300 text-xs uppercase tracking-wider font-bold">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Voting paused by Election Commissioner</span>
              </div>
            )}

            <button
              onClick={onOpenVerifyModal}
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
              id="hero-check-status-cta"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Check Vote Status</span>
            </button>

            <button
              onClick={onOpenManifestoModal}
              className="px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
              id="hero-view-manifestos-cta"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Manifestos</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
