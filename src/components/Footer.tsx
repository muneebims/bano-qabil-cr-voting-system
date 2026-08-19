import React, { useState } from 'react';
import { useElection } from '../context/ElectionContext';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface FooterProps {
  onOpenAdminModal: () => void;
  onOpenVerifyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdminModal,
  onOpenVerifyModal
}) => {
  const { remainingVotes, maxVotes, isCompleted, verifyVoteStatus } = useElection();
  const [quickId, setQuickId] = useState('');
  const [quickResult, setQuickResult] = useState<{ searched: boolean; found: boolean; message: string } | null>(null);

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickId.trim()) return;
    const cleanId = quickId.trim();
    if (cleanId.length !== 7 || !cleanId.startsWith('138') || !/^\d+$/.test(cleanId)) {
      setQuickResult({
        searched: true,
        found: false,
        message: 'Must be 7 digits starting with 138'
      });
      return;
    }
    const record = verifyVoteStatus(cleanId);
    if (record) {
      setQuickResult({
        searched: true,
        found: true,
        message: `Verified: Voted for ${record.candidateName.split(' ')[0]} (Receipt: ${record.receiptCode.substring(0, 14)}...)`
      });
    } else {
      setQuickResult({
        searched: true,
        found: false,
        message: `No vote recorded yet for ID ${cleanId}. Eligible to vote!`
      });
    }
  };

  return (
    <footer className="bg-black/60 border-t border-white/5 text-slate-400 text-xs backdrop-blur-md">
      {/* Immersive Quick Verification Action Strip */}
      <div className="px-6 sm:px-12 py-6 bg-emerald-950/20 border-b border-white/5">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <form onSubmit={handleQuickVerify} className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 shrink-0">
              Quick Verification
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={quickId}
                maxLength={7}
                onChange={(e) => {
                  setQuickId(e.target.value);
                  if (quickResult) setQuickResult(null);
                }}
                placeholder="138XXXX" 
                className="bg-black border border-white/10 rounded px-3.5 py-1.5 text-xs font-mono text-white w-36 sm:w-44 focus:outline-none focus:border-emerald-500 transition-colors"
                id="footer-quick-verify-input"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-emerald-500 hover:text-black text-white text-[10px] uppercase tracking-widest font-bold rounded transition-colors cursor-pointer"
              id="footer-quick-verify-btn"
            >
              Verify
            </button>
            <p className="text-[10px] text-slate-500 italic hidden sm:inline">
              * ID must be 7 digits starting with 138.
            </p>
          </form>

          {/* Quick Result Feedback */}
          {quickResult && (
            <div className={`text-xs px-3 py-1 rounded border flex items-center gap-2 ${
              quickResult.found 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                : 'bg-slate-900 text-slate-300 border-white/10'
            }`}>
              {quickResult.found ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              <span>{quickResult.message}</span>
            </div>
          )}

          <div className="flex items-center gap-8 shrink-0">
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5 font-bold">Remaining Slots</p>
              <p className="text-sm font-black text-emerald-400 tracking-wider">
                {isCompleted ? '0 VOTES (CLOSED)' : `${remainingVotes} VOTES LEFT`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5 font-bold">System Status</p>
              <p className="text-sm font-black text-white uppercase tracking-wider">
                {isCompleted ? 'FINALIZED' : 'LIVE AUDIT'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
              style={{ background: 'linear-gradient(135deg, #00ff9c, #00897b)' }}
            >
              <span className="font-black text-black text-sm">BQ</span>
            </div>
            <div>
              <span className="font-bold text-white tracking-widest text-xs uppercase">Bano Qabil CR Election 2025</span>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Autonomous Student Democratic Voting Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
            <a href="#candidates" className="hover:text-emerald-400 transition-colors">Candidates</a>
            <a href="#developer-team" className="hover:text-emerald-400 transition-colors">Dev Team</a>
            <a href="#rules" className="hover:text-emerald-400 transition-colors">Rules</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About CR</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Helpdesk</a>
            <button onClick={onOpenVerifyModal} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Verify ID
            </button>
            <button onClick={onOpenAdminModal} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Admin Portal
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
          <p>© 2025 Bano Qabil IT Initiative. Dynamic {maxVotes} Capacity via Firebase Cloud.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptographic One-Student-One-Vote System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
