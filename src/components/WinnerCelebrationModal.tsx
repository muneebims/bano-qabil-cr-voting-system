import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useElection } from '../context/ElectionContext';
import { MAX_TOTAL_VOTES } from '../types';
import { 
  Trophy, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle2, 
  Users, 
  Award,
  Crown
} from 'lucide-react';

interface WinnerCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WinnerCelebrationModal: React.FC<WinnerCelebrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    winnerResult, 
    candidates, 
    totalVotes, 
    maxVotes,
    soundEnabled, 
    toggleSound, 
    playWinnerSound 
  } = useElection();

  // Launch confetti on mount when opened
  useEffect(() => {
    if (isOpen) {
      // Multi-stage confetti celebration
      try {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 }
        };

        function fire(particleRatio: number, opts: confetti.Options) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
          colors: ['#10B981', '#F59E0B', '#3B82F6', '#FFFFFF']
        });
        fire(0.2, {
          spread: 60,
          colors: ['#10B981', '#F59E0B', '#10B981']
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          colors: ['#F59E0B', '#E11D48', '#8B5CF6']
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45
        });
      } catch (err) {
        // Confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || !winnerResult) return null;

  const { isTie, winnerCandidate } = winnerResult;
  const [c1, c2] = candidates;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900/90 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden text-center p-6 sm:p-10 backdrop-blur-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={playWinnerSound}
            title="Replay Celebration Fanfare"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 border border-white/10 transition-colors"
            id="winner-replay-sound-btn"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={toggleSound}
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            id="winner-sound-toggle-btn"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            id="winner-modal-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4 text-[10px] uppercase font-bold text-emerald-400 tracking-[0.2em]">
          <Trophy className="w-3.5 h-3.5 text-emerald-400" />
          <span>Election Complete</span>
        </div>

        {/* RESULTS SECTION */}
        {isTie ? (
          /* TIE RESULT VIEW */
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
                Final Result: <span className="font-bold text-amber-400 italic">Historic Tie</span>
              </h2>
              <p className="mt-2 text-slate-400 text-sm max-w-lg mx-auto">
                Both candidates have received an identical number of votes.
              </p>
            </div>

            {/* Tie Candidates Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {candidates.map((cand) => (
                <div key={cand.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-4">
                  <img src={cand.photoUrl} alt={cand.name} className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                  <div>
                    <h4 className="text-base font-bold text-white">{cand.name}</h4>
                    <p className="text-xs text-slate-400">{cand.track}</p>
                    <div className="text-lg font-bold text-amber-400 font-mono mt-1">
                      {cand.votes} Votes (50%)
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400">
              Total Votes: <strong className="text-emerald-400 font-mono">{totalVotes} / {maxVotes}</strong> (100% Student Participation Reached).
            </div>
          </div>
        ) : (
          /* CLEAR WINNER VIEW */
          <div className="space-y-6">
            <div className="relative inline-block mx-auto mt-2">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto">
                <img 
                  src={winnerCandidate?.photoUrl} 
                  alt={winnerCandidate?.name}
                  className="w-full h-full rounded-3xl object-cover border-2 border-emerald-400 shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-500/20"
                />
                <div className="absolute -top-3 -right-2 w-9 h-9 rounded-xl bg-emerald-400 text-black flex items-center justify-center shadow-lg shadow-emerald-400/40 rotate-12">
                  <Crown className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Elected Class Representative
              </p>
              <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight mt-1">
                <span className="font-bold text-white">{winnerCandidate?.name}</span>
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                {winnerCandidate?.track} • 2025 Academic Term
              </p>
            </div>

            {/* Vote Stat Box */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-black/60 border border-white/5">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Winner Votes</div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono mt-0.5">
                  {winnerCandidate?.votes}
                </div>
                <div className="text-[10px] text-slate-400">
                  {Math.round(((winnerCandidate?.votes || 0) / (maxVotes || 1)) * 100)}% of total
                </div>
              </div>

              <div className="text-center p-3 rounded-xl bg-black/60 border border-white/5">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Cast</div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-0.5">
                  {totalVotes} / {maxVotes}
                </div>
                <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono">
                  100% Target Reached
                </div>
              </div>
            </div>

            {/* Complete Breakdown Bar */}
            <div className="max-w-md mx-auto space-y-2 text-left">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>{c1?.name}: <strong className="text-emerald-400">{c1?.votes} votes</strong></span>
                <span>{c2?.name}: <strong className="text-slate-300">{c2?.votes} votes</strong></span>
              </div>
              <div className="w-full h-2.5 bg-black rounded-full overflow-hidden flex border border-white/10">
                <div 
                  className="bg-emerald-400 h-full transition-all duration-1000" 
                  style={{ width: `${Math.round(((c1?.votes || 0) / (maxVotes || 1)) * 100)}%` }} 
                />
                <div 
                  className="bg-slate-600 h-full transition-all duration-1000" 
                  style={{ width: `${Math.round(((c2?.votes || 0) / (maxVotes || 1)) * 100)}%` }} 
                />
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Congratulations to <strong className="text-white">{winnerCandidate?.name}</strong> on being elected Class Representative for Bano Qabil 3.0!
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-black hover:bg-emerald-400 font-bold uppercase tracking-widest text-xs shadow-xl shadow-white/5 transition-all"
            id="winner-close-results-btn"
          >
            View Dashboard & Results
          </button>
        </div>

      </div>
    </div>
  );
};
