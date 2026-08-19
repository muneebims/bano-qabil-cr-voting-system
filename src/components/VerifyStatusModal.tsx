import React, { useState } from 'react';
import { useElection } from '../context/ElectionContext';
import { maskStudentId } from '../utils/validation';
import { 
  X, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Info, 
  Vote,
  Clock,
  UserX,
  Loader2
} from 'lucide-react';

interface VerifyStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVoteModal?: () => void;
}

export const VerifyStatusModal: React.FC<VerifyStatusModalProps> = ({
  isOpen,
  onClose,
  onOpenVoteModal
}) => {
  const { checkVoteStatus, isCompleted, isPaused } = useElection();
  const [studentIdInput, setStudentIdInput] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<{
    searched: boolean;
    hasVoted: boolean;
    status: 'valid_voted' | 'valid_not_voted' | 'invalid_id' | 'unauthorized_id';
    message: string;
    voteRecord?: any;
    searchedId?: string;
  }>({
    searched: false,
    hasVoted: false,
    status: 'valid_not_voted',
    message: ''
  });

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim()) return;

    setIsChecking(true);
    try {
      const res = await checkVoteStatus(studentIdInput);
      setQueryResult({
        searched: true,
        hasVoted: res.hasVoted,
        status: res.status,
        message: res.message,
        voteRecord: res.voteRecord,
        searchedId: studentIdInput.trim()
      });
    } catch (err) {
      console.error('Failed to check vote status:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 7);
    setStudentIdInput(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Verify Vote Status</h3>
              <p className="text-[11px] text-slate-400">Check if your Student ID has cast a ballot</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            id="verify-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="verifyStudentIdInput" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Enter 7-Digit Student ID
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="verifyStudentIdInput"
                    type="text"
                    inputMode="numeric"
                    value={studentIdInput}
                    onChange={handleInputChange}
                    placeholder="e.g. 1384021"
                    maxLength={7}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white font-mono text-base tracking-wider placeholder-slate-600 focus:outline-none transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                    {studentIdInput.length}/7
                  </span>
                </div>
                
                <button
                  type="submit"
                  disabled={isChecking || !studentIdInput}
                  className="px-6 py-3 rounded-xl bg-white text-black hover:bg-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  id="verify-search-submit-btn"
                >
                  {isChecking ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <span>{isChecking ? 'Checking...' : 'Verify'}</span>
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">
                Must be 7 digits starting with <strong className="text-emerald-400">138</strong> (e.g. 1384021).
              </p>
            </div>
          </form>

          {/* Results Area */}
          {queryResult.searched && (
            <div className="animate-fadeIn">
              
              {/* 1. INVALID FORMAT */}
              {queryResult.status === 'invalid_id' && (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Invalid Student ID</span>
                  </div>
                  <p className="text-xs text-red-300 leading-relaxed pl-6">
                    {queryResult.message || 'ID must be exactly 7 digits and start with 138 (e.g. 1384021).'}
                  </p>
                </div>
              )}

              {/* 2. UNAUTHORIZED ID */}
              {queryResult.status === 'unauthorized_id' && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <UserX className="w-4 h-4 shrink-0" />
                    <span>Unauthorized Student ID</span>
                  </div>
                  <p className="text-xs text-amber-200 leading-relaxed pl-6">
                    {queryResult.message || `Student ID ${queryResult.searchedId} is not recognized on the authorized Bano Qabil cohort roster.`}
                  </p>
                </div>
              )}

              {/* 3. VALID FORMAT BUT NOT VOTED */}
              {queryResult.status === 'valid_not_voted' && (
                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>You have not voted yet</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Student ID <strong className="text-white font-mono">{queryResult.searchedId}</strong> has <strong className="text-emerald-400">not cast a vote yet</strong>. Eligible to vote!
                  </p>
                  
                  {!isCompleted && !isPaused && onOpenVoteModal && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenVoteModal();
                        }}
                        className="w-full py-3 rounded-xl bg-white text-black hover:bg-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-white/5 cursor-pointer"
                        id="verify-cast-now-btn"
                      >
                        <Vote className="w-4 h-4" />
                        <span>Cast Vote for this ID Now</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 4. ALREADY VOTED */}
              {queryResult.status === 'valid_voted' && queryResult.voteRecord && (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 shadow-lg shadow-emerald-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>You have already voted</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
                      RECORDED #{queryResult.voteRecord.voteNumber}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    You have already cast a vote in this election with Student ID <strong className="text-white font-mono">{maskStudentId(queryResult.searchedId || '')}</strong>.
                  </p>

                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 text-xs font-mono space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Candidate:</span>
                      <span className="text-white font-bold">{queryResult.voteRecord.candidateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Timestamp:</span>
                      <span className="text-slate-300">{queryResult.voteRecord.timestamp}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/5 text-[11px]">
                      <span className="text-slate-400">Receipt Code:</span>
                      <span className="text-emerald-400 font-bold">{queryResult.voteRecord.receiptCode}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Explanation Notes */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Election Rules Summary</span>
            </div>
            <p>• Only enrolled Bano Qabil students with valid 7-digit 138-prefix IDs are eligible.</p>
            <p>• Each ID is permitted exactly one vote.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
