import React, { useState, useEffect } from 'react';
import { useElection } from '../context/ElectionContext';
import { Candidate } from '../types';
import { maskStudentId } from '../utils/validation';
import { 
  X, 
  Vote, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Printer, 
  Copy, 
  Check, 
  Info,
  Trophy,
  Loader2
} from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCandidateId?: string;
  onViewWinner?: () => void;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  isOpen,
  onClose,
  initialCandidateId,
  onViewWinner
}) => {
  const { 
    candidates, 
    castVote, 
    totalVotes, 
    maxVotes,
    isCompleted, 
    isPaused, 
    lastVoteReceipt, 
    clearLastVoteReceipt 
  } = useElection();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedReceipt, setCopiedReceipt] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialCandidateId) {
      setSelectedCandidateId(initialCandidateId);
    } else if (candidates.length > 0 && !selectedCandidateId) {
      setSelectedCandidateId(candidates[0].id);
    }
  }, [initialCandidateId, candidates, selectedCandidateId]);

  // Reset local state on open
  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setStudentId('');
      setCopiedReceipt(false);
      clearLastVoteReceipt();
    }
  }, [isOpen, clearLastVoteReceipt]);

  if (!isOpen) return null;

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 7); // keep numbers only, up to 7 digits
    setStudentId(val);
    setErrorMessage('');
  };

  const handleSubmitVote = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isCompleted || totalVotes >= maxVotes) {
      setErrorMessage(`Election Closed — Maximum ${maxVotes} Votes Reached.`);
      return;
    }

    if (isPaused) {
      setErrorMessage('Voting is currently paused by the Election Commissioner.');
      return;
    }

    if (!selectedCandidateId) {
      setErrorMessage('Please select a candidate before casting your vote.');
      return;
    }

    setIsSubmitting(true);
    const result = await castVote(studentId, selectedCandidateId);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      setErrorMessage('');
    }
  };

  const handleCopyReceipt = () => {
    if (lastVoteReceipt) {
      const text = `Bano Qabil CR Election 2025 Receipt\nStudent ID: ${maskStudentId(lastVoteReceipt.studentId)}\nCandidate: ${lastVoteReceipt.candidateName}\nReceipt Code: ${lastVoteReceipt.receiptCode}\nTimestamp: ${lastVoteReceipt.timestamp}\nVote #${lastVoteReceipt.voteNumber} of ${maxVotes}`;
      navigator.clipboard.writeText(text).then(() => {
        setCopiedReceipt(true);
        setTimeout(() => setCopiedReceipt(false), 2500);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Vote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {lastVoteReceipt ? 'Digital Vote Receipt' : 'Cast Official Ballot'}
              </h3>
              <p className="text-[11px] text-slate-400">Bano Qabil 3.0 • Class Representative 2025</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            id="vote-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          
          {/* SUCCESS STATE: VOTE RECEIPT */}
          {lastVoteReceipt ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">Vote Successfully Recorded</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Your vote has been cryptographically recorded in the Firebase cloud ledger.
                </p>
                {lastVoteReceipt.voteNumber >= maxVotes && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[10px] uppercase font-bold tracking-wider border border-amber-500/20">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>You cast the decisive {maxVotes}th vote! Election Completed.</span>
                  </div>
                )}
              </div>

              {/* Official Receipt Card */}
              <div className="p-6 rounded-2xl bg-black/60 border border-white/5 font-mono text-xs space-y-3 relative overflow-hidden shadow-inner">
                <div className="flex justify-between items-center pb-3 border-b border-white/5 text-[11px] text-slate-400">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Bano Qabil E-Vote Verification</span>
                  <span className="text-white">#{lastVoteReceipt.voteNumber} / {maxVotes}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Student ID (Masked):</span>
                  <span className="text-white font-bold">{maskStudentId(lastVoteReceipt.studentId)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate Chosen:</span>
                  <span className="text-emerald-400 font-bold">{lastVoteReceipt.candidateName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-slate-300">{lastVoteReceipt.timestamp}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-white/5">
                  <span className="text-slate-400">Receipt Hash:</span>
                  <span className="text-emerald-400 font-bold tracking-wider">{lastVoteReceipt.receiptCode}</span>
                </div>
              </div>

              {/* Action Buttons for Receipt */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleCopyReceipt}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-white/10 cursor-pointer"
                  id="receipt-copy-btn"
                >
                  {copiedReceipt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedReceipt ? 'Receipt Copied' : 'Copy Receipt Text'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-white/10 cursor-pointer"
                  id="receipt-print-btn"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>

                {lastVoteReceipt.voteNumber >= maxVotes && onViewWinner ? (
                  <button
                    onClick={() => {
                      onClose();
                      onViewWinner();
                    }}
                    className="py-3.5 px-5 rounded-xl bg-emerald-400 text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/20 hover:bg-emerald-300 cursor-pointer"
                    id="receipt-winner-view-btn"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>View Winner</span>
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="py-3.5 px-6 rounded-xl bg-white text-black hover:bg-emerald-400 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer"
                    id="receipt-done-btn"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* BALLOT FORM */
            <form onSubmit={handleSubmitVote} className="space-y-6">
              
              {/* Election limit info banner */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-400">Limit: <strong className="text-white">{maxVotes} Votes</strong></span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  {totalVotes} / {maxVotes} Cast
                </span>
              </div>

              {/* Step 1: Candidate Selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  1. Select Candidate
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {candidates.map((cand: Candidate) => {
                    const isSelected = selectedCandidateId === cand.id;
                    return (
                      <button
                        type="button"
                        key={cand.id}
                        onClick={() => {
                          setSelectedCandidateId(cand.id);
                          setErrorMessage('');
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                            : 'bg-black/40 border-white/5 hover:border-white/20'
                        }`}
                        id={`vote-select-${cand.id}`}
                      >
                        <img 
                          src={cand.photoUrl} 
                          alt={cand.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-bold text-white truncate">{cand.name}</h5>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{cand.track}</p>
                          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{cand.votes} votes</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Student ID Input with format validation */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="studentIdInput" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    2. Enter 7-Digit Student ID
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    Starts with <strong className="text-emerald-400">138</strong>
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="studentIdInput"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={studentId}
                    onChange={handleIdChange}
                    placeholder="e.g. 1384021"
                    maxLength={7}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white font-mono text-base tracking-wider placeholder-slate-600 focus:outline-none transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                    {studentId.length}/7 digits
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                  Example valid IDs: <span className="font-mono text-slate-300">1384021</span>, <span className="font-mono text-slate-300">1387927</span>. IDs starting with other digits are rejected.
                </p>
              </div>

              {/* Error Message Display */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Privacy Guarantee Note */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Secret Ballot: Your ID is verified only to prevent double voting. Receipts mask identity.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isCompleted || isPaused}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  isCompleted || isPaused
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'bg-white text-black hover:bg-emerald-400 shadow-white/5 active:scale-[0.99]'
                }`}
                id="submit-vote-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Recording in Firebase Ledger...</span>
                  </>
                ) : (
                  <>
                    <Vote className="w-4 h-4" />
                    <span>
                      {isCompleted 
                        ? 'Election Closed' 
                        : `Confirm Vote for ${selectedCandidate?.name || 'Candidate'}`
                      }
                    </span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
