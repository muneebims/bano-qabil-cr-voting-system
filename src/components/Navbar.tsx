import React, { useState } from 'react';
import { useElection } from '../context/ElectionContext';
import { 
  Vote, 
  ShieldCheck, 
  Lock, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Menu, 
  X,
  Sparkles,
  CheckCircle2,
  Code2
} from 'lucide-react';

interface NavbarProps {
  onOpenVoteModal: () => void;
  onOpenVerifyModal: () => void;
  onOpenAdminModal: () => void;
  onOpenManifestoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenVoteModal,
  onOpenVerifyModal,
  onOpenAdminModal,
  onOpenManifestoModal
}) => {
  const { 
    totalVotes, 
    maxVotes,
    isCompleted, 
    isPaused, 
    soundEnabled, 
    toggleSound, 
    openWinnerModal,
    winnerResult 
  } = useElection();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/40 border-b border-white/10 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
              id="nav-logo-btn"
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #00ff9c, #00897b)' }}
              >
                <span className="font-black text-black text-xl tracking-tight">BQ</span>
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-widest uppercase text-white group-hover:text-emerald-400 transition-colors">
                  Bano Qabil
                </h1>
                <p className="text-[10px] text-emerald-400 opacity-85 uppercase tracking-tighter font-semibold">
                  CR Voting System
                </p>
              </div>
            </button>
          </div>

          {/* Center Immersive Vote Tracker */}
          <div className="hidden md:flex flex-col items-center">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-white">
                {totalVotes} <span className="text-emerald-400">/</span> {maxVotes}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                {isCompleted ? 'Election Closed' : 'Total Votes'}
              </span>
            </div>
            <div className="w-48 lg:w-56 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-emerald-400 shadow-[0_0_10px_#00ff9c] transition-all duration-500" 
                style={{ width: `${Math.min(100, (totalVotes / (maxVotes || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-6 text-xs uppercase tracking-wider font-bold text-slate-300">
            <button 
              onClick={() => scrollToSection('candidates')} 
              className="hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              id="nav-candidates-link"
            >
              Candidates
            </button>
            <button 
              onClick={onOpenManifestoModal} 
              className="hover:text-emerald-400 transition-colors py-1 flex items-center gap-1.5 cursor-pointer"
              id="nav-manifestos-link"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Manifestos
            </button>
            <button 
              onClick={() => scrollToSection('developer-team')} 
              className="hover:text-emerald-400 transition-colors py-1 flex items-center gap-1.5 cursor-pointer"
              id="nav-team-link"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              Dev Team
            </button>
            <button 
              onClick={() => scrollToSection('rules')} 
              className="hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              id="nav-rules-link"
            >
              Rules
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              id="nav-about-link"
            >
              About CR
            </button>
          </div>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? "Sound: ON" : "Sound: Muted"}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors focus:outline-none cursor-pointer"
              id="nav-sound-toggle-btn"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Winner Button (if completed) */}
            {isCompleted && (
              <button
                onClick={openWinnerModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-[11px] uppercase tracking-widest font-bold bg-amber-400 hover:bg-amber-300 text-black transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                id="nav-winner-btn"
              >
                <Trophy className="w-3.5 h-3.5" />
                {winnerResult?.isTie ? 'Tie Result' : 'View Winner'}
              </button>
            )}

            {/* Check Status Button */}
            <button
              onClick={onOpenVerifyModal}
              className="px-4 py-2 border border-white/20 rounded-md text-[11px] uppercase tracking-widest font-bold text-white hover:bg-white/5 hover:border-white/40 transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
              id="nav-verify-vote-btn"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Check Status</span>
            </button>

            {/* Cast Vote CTA (if active) */}
            {!isCompleted && !isPaused && (
              <button
                onClick={onOpenVoteModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-md text-[11px] uppercase tracking-widest font-bold text-white shadow-lg shadow-emerald-900/30 transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
                id="nav-cast-vote-btn"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cast Vote</span>
              </button>
            )}

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdminModal}
              title="Election Commissioner Admin Portal"
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-[11px] uppercase tracking-widest font-bold text-slate-300 hover:text-white transition-colors focus:outline-none flex items-center gap-1.5 cursor-pointer"
              id="nav-admin-portal-btn"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Admin</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:hidden">
            <div className="px-2.5 py-1 rounded-full text-[11px] font-black bg-white/5 text-emerald-400 border border-emerald-500/30">
              {totalVotes}/{maxVotes}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none cursor-pointer"
              id="nav-mobile-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
            <div className="text-xs text-slate-400 font-medium">
              Election Status: <span className={isCompleted ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>{isCompleted ? "COMPLETED" : isPaused ? "PAUSED" : "ACTIVE"}</span>
            </div>
            <div className="text-xs font-bold text-slate-200">
              {totalVotes} / {maxVotes} Votes
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => scrollToSection('candidates')}
              className="px-3 py-2 text-left rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              Candidates
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenManifestoModal(); }}
              className="px-3 py-2 text-left rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Manifestos
            </button>
            <button
              onClick={() => scrollToSection('developer-team')}
              className="px-3 py-2 text-left rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              Dev Team
            </button>
            <button
              onClick={() => scrollToSection('rules')}
              className="px-3 py-2 text-left rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              Rules & Guidelines
            </button>
          </div>

          <div className="pt-2 space-y-2">
            {!isCompleted && !isPaused && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenVoteModal(); }}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                CAST YOUR VOTE NOW
              </button>
            )}

            {isCompleted && (
              <button
                onClick={() => { setMobileMenuOpen(false); openWinnerModal(); }}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                VIEW FINAL ELECTION RESULTS
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenVerifyModal(); }}
                className="py-2 rounded-lg bg-slate-900 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                CHECK STATUS
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdminModal(); }}
                className="py-2 rounded-lg bg-slate-900 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                ADMIN PORTAL
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
