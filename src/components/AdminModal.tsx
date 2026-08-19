import React, { useState, useEffect } from 'react';
import { useElection } from '../context/ElectionContext';
import { maskStudentId } from '../utils/validation';
import { 
  X, 
  Lock, 
  RotateCcw, 
  Pause, 
  Play, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  Vote, 
  Search, 
  FileSpreadsheet, 
  Sparkles, 
  AlertTriangle,
  KeyRound,
  Activity,
  History,
  Settings,
  Sliders,
  Database,
  LogOut,
  Trophy,
  Loader2,
  ShieldCheck
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    candidates, 
    voteRecords, 
    votedStudentIds, 
    status, 
    maxVotes,
    totalVotes, 
    remainingVotes, 
    participationPercent, 
    isCompleted, 
    isPaused, 
    resetElectionData, 
    updateMaxVotes,
    togglePause,
    simulateQuickVotes,
    isAdminLoggedIn,
    adminUser,
    loginWithGoogle,
    logoutAdmin,
    fetchElectionHistory,
    electionHistory
  } = useElection();

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'audit' | 'history' | 'tools'>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [customMaxVotes, setCustomMaxVotes] = useState<string>(String(maxVotes));
  const [isSubmittingLimit, setIsSubmittingLimit] = useState<boolean>(false);

  useEffect(() => {
    setCustomMaxVotes(String(maxVotes));
  }, [maxVotes]);

  useEffect(() => {
    if (isOpen && isAdminLoggedIn && activeTab === 'history') {
      fetchElectionHistory();
    }
  }, [isOpen, isAdminLoggedIn, activeTab, fetchElectionHistory]);

  if (!isOpen) return null;

  const showNotification = (message: string, isError = false) => {
    setActionFeedback({ message, isError });
    setTimeout(() => {
      setActionFeedback(null);
    }, 4000);
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError('');
    const result = await loginWithGoogle();
    setIsLoggingIn(false);
    if (result.success) {
      setLoginError('');
      showNotification(result.message);
    } else {
      setLoginError(result.message);
    }
  };

  const handleExecuteReset = async () => {
    setShowConfirmReset(false);
    const result = await resetElectionData();
    if (result.success) {
      showNotification(result.message);
    } else {
      showNotification(result.message, true);
    }
  };

  const handleTogglePause = async () => {
    const result = await togglePause();
    if (result.success) {
      showNotification(result.message);
    } else {
      showNotification(result.message, true);
    }
  };

  const handleUpdateLimit = async (limitVal: number) => {
    if (limitVal < 1) {
      showNotification('Vote limit must be at least 1.', true);
      return;
    }
    setIsSubmittingLimit(true);
    const result = await updateMaxVotes(limitVal);
    setIsSubmittingLimit(false);
    if (result.success) {
      showNotification(result.message);
    } else {
      showNotification(result.message, true);
    }
  };

  const handleCustomLimitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customMaxVotes, 10);
    if (isNaN(parsed) || parsed < 1) {
      showNotification('Please enter a valid number (minimum 1).', true);
      return;
    }
    handleUpdateLimit(parsed);
  };

  const handleExportCSV = () => {
    if (voteRecords.length === 0) {
      showNotification('No vote records to export yet.', true);
      return;
    }
    const headers = ['Vote #', 'Student ID (Masked)', 'Candidate ID', 'Candidate Name', 'Timestamp', 'Receipt Code'];
    const rows = voteRecords.map(r => [
      r.voteNumber,
      maskStudentId(r.studentId),
      r.candidateId,
      `"${r.candidateName}"`,
      `"${r.timestamp}"`,
      r.receiptCode
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bano_qabil_cr_election_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('CSV exported successfully.');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      electionTitle: 'Bano Qabil CR Election 2025',
      exportTimestamp: new Date().toISOString(),
      status,
      totalVotes,
      maxVotes,
      candidates,
      voteRecords
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bano_qabil_cr_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('JSON exported successfully.');
  };

  const filteredRecords = voteRecords.filter(r => 
    r.studentId.includes(searchQuery) ||
    r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.receiptCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Commissioner <span className="text-emerald-400">Portal</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10 uppercase tracking-widest flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-400" />
                  Firebase Cloud
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-time election ledger, limits & cloud commissioner controls</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <div className="flex items-center gap-2">
                {adminUser?.email && (
                  <span className="hidden md:inline-block px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                    {adminUser.email}
                  </span>
                )}
                <button
                  onClick={logoutAdmin}
                  className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-red-400 hover:bg-white/5 border border-white/10 transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  title="Logout"
                  id="admin-logout-btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              id="admin-modal-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOT AUTHENTICATED: GOOGLE LOGIN SCREEN */}
        {!isAdminLoggedIn ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center mx-auto text-emerald-400 shadow-2xl">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">Commissioner Portal</h4>
              <p className="text-xs text-slate-400">
                Sign in with your authorized Google Account to manage live election tallies, voting limits, and audit logs.
              </p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full py-3.5 px-4 rounded-2xl bg-white text-black hover:bg-slate-100 active:scale-[0.98] font-bold text-xs uppercase tracking-wider shadow-xl shadow-white/5 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-3 border border-white/20"
                id="admin-google-login-btn"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2 text-left animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-red-300 font-bold uppercase text-[10px] tracking-wider mb-0.5">Authentication Status</strong>
                    <span>{loginError}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-500 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Trust Admin Authorization</span>
              </div>
              <p>• Access requires a recognized Election Commissioner Google account.</p>
              <p>• All administrative actions are verified against Firestore security rules on write.</p>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="flex-1 overflow-hidden flex flex-col">
            
            {/* Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 border-b border-white/5 bg-black/40 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 sm:px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-emerald-400 text-emerald-400 bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
                id="admin-tab-overview"
              >
                Overview & Tally
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 sm:px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-emerald-400 text-emerald-400 bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
                id="admin-tab-settings"
              >
                Limit Settings
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3 sm:px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                  activeTab === 'audit'
                    ? 'border-emerald-400 text-emerald-400 bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
                id="admin-tab-audit"
              >
                Live Audit ({voteRecords.length})
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 sm:px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                  activeTab === 'history'
                    ? 'border-emerald-400 text-emerald-400 bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
                id="admin-tab-history"
              >
                Election History
              </button>

              <button
                onClick={() => setActiveTab('tools')}
                className={`px-3 sm:px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                  activeTab === 'tools'
                    ? 'border-emerald-400 text-emerald-400 bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
                id="admin-tab-tools"
              >
                Test Simulator
              </button>
            </div>

            {/* Notification Feedback */}
            {actionFeedback && (
              <div className={`mx-6 mt-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                actionFeedback.isError
                  ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              }`}>
                {actionFeedback.isError ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{actionFeedback.message}</span>
              </div>
            )}

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* TAB 1: OVERVIEW & CONTROLS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Votes</p>
                      <div className="text-2xl font-bold text-white font-mono mt-1">
                        {totalVotes} <span className="text-xs text-slate-500 font-sans">/ {maxVotes}</span>
                      </div>
                      <p className="text-[10px] text-emerald-400 font-mono mt-1">{remainingVotes} Remaining</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Participation</p>
                      <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                        {participationPercent}%
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">Target: {maxVotes} votes</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Election Status</p>
                      <div className="text-base font-black mt-1">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${
                          isCompleted
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : isPaused
                              ? 'bg-amber-900/30 text-amber-400 border border-amber-700/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">
                        {isCompleted ? 'Max Reached' : isPaused ? 'Voting Paused' : 'Accepting Votes'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Audited Voters</p>
                      <div className="text-2xl font-bold text-white font-mono mt-1">
                        {votedStudentIds.length}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">Unique 138-IDs in Cloud</p>
                    </div>
                  </div>

                  {/* Candidate Vote Breakdown */}
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      Live Candidate Vote Distribution
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {candidates.map(cand => {
                        const pct = totalVotes > 0 ? Math.round((cand.votes / totalVotes) * 100) : 0;
                        return (
                          <div key={cand.id} className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-sm">{cand.name}</span>
                              <span className="font-mono font-bold text-emerald-400 text-sm">
                                {cand.votes} votes ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/10">
                              <div 
                                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="text-[11px] text-slate-400">{cand.track}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Administrative Action Controls */}
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Live Election Controls
                    </h4>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Pause / Resume */}
                      <button
                        onClick={handleTogglePause}
                        disabled={isCompleted}
                        className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                            : isPaused
                              ? 'bg-white text-black hover:bg-emerald-400'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                        }`}
                        id="admin-pause-resume-btn"
                      >
                        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        <span>{isPaused ? 'Resume Election' : 'Pause Voting'}</span>
                      </button>

                      {/* Export CSV */}
                      <button
                        onClick={handleExportCSV}
                        className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
                        id="admin-export-csv-btn"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Export CSV</span>
                      </button>

                      {/* Export JSON */}
                      <button
                        onClick={handleExportJSON}
                        className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
                        id="admin-export-json-btn"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                        <span>Export JSON</span>
                      </button>

                      {/* Complete Reset Button */}
                      <button
                        onClick={() => setShowConfirmReset(true)}
                        className="px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-white text-xs font-bold uppercase tracking-wider border border-red-500/30 flex items-center gap-2 transition-all ml-auto cursor-pointer"
                        id="admin-reset-election-btn"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset / New Election</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: VOTE LIMIT SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-5">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-emerald-400" />
                        Configure Maximum Election Votes
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Select a standard vote cap or enter a custom limit. When total votes reach this number, the election automatically completes and announces the winner.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Current Active Limit:</span>
                      <span className="text-lg font-bold font-mono text-emerald-400">{maxVotes} Votes</span>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        Quick Preset Caps
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[10, 20, 50, 100].map(val => (
                          <button
                            key={val}
                            onClick={() => handleUpdateLimit(val)}
                            disabled={isSubmittingLimit}
                            className={`p-3.5 rounded-xl border font-mono text-sm font-bold transition-all cursor-pointer ${
                              maxVotes === val
                                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                                : 'bg-black/60 hover:bg-white/10 text-white border-white/10'
                            }`}
                          >
                            {val} Votes
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Limit Input */}
                    <form onSubmit={handleCustomLimitSubmit} className="space-y-3 pt-2">
                      <label htmlFor="customVoteCapInput" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        Custom Vote Cap
                      </label>
                      <div className="flex gap-3">
                        <input
                          id="customVoteCapInput"
                          type="number"
                          min="1"
                          max="10000"
                          value={customMaxVotes}
                          onChange={e => setCustomMaxVotes(e.target.value)}
                          placeholder="e.g. 75"
                          className="flex-1 px-4 py-3 rounded-xl bg-black border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingLimit}
                          className="px-6 py-3 rounded-xl bg-white text-black hover:bg-emerald-400 font-bold uppercase tracking-wider text-xs transition-all cursor-pointer"
                        >
                          Save Limit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 3: AUDIT LEDGER */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by ID, candidate, receipt..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      Showing {filteredRecords.length} of {voteRecords.length} cloud records
                    </div>
                  </div>

                  {voteRecords.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/5 space-y-2">
                      <Vote className="w-10 h-10 text-slate-600 mx-auto" />
                      <h5 className="text-sm font-bold text-slate-300">No Votes Cast Yet</h5>
                      <p className="text-xs text-slate-500">The election ledger is currently clean (0 / {maxVotes} votes).</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-black/40 border border-white/5 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-black/60 text-slate-400 border-b border-white/5">
                            <tr>
                              <th className="p-3.5 font-bold">#</th>
                              <th className="p-3.5 font-bold">Student ID</th>
                              <th className="p-3.5 font-bold">Candidate</th>
                              <th className="p-3.5 font-bold">Receipt Hash</th>
                              <th className="p-3.5 font-bold">Timestamp</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-slate-300">
                            {filteredRecords.map((rec) => (
                              <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-3.5 text-emerald-400 font-bold">#{rec.voteNumber}</td>
                                <td className="p-3.5 text-white font-bold">{maskStudentId(rec.studentId)}</td>
                                <td className="p-3.5 text-slate-200">{rec.candidateName}</td>
                                <td className="p-3.5 text-emerald-400">{rec.receiptCode}</td>
                                <td className="p-3.5 text-slate-400">{rec.timestamp}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ELECTION HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <History className="w-4 h-4 text-emerald-400" />
                        Archived Election Records
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Past completed or reset elections stored permanently in Firebase Firestore.
                      </p>
                    </div>
                    <button
                      onClick={fetchElectionHistory}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono border border-white/10"
                    >
                      Refresh
                    </button>
                  </div>

                  {electionHistory.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/5 space-y-2">
                      <History className="w-10 h-10 text-slate-600 mx-auto" />
                      <h5 className="text-sm font-bold text-slate-300">No Election History Yet</h5>
                      <p className="text-xs text-slate-500">Completed or reset elections will be safely archived here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {electionHistory.map(hist => (
                        <div key={hist.id} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-amber-400" />
                              <span className="font-bold text-white text-sm">{hist.title}</span>
                              <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                                {hist.electionId}
                              </span>
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-400">
                              {hist.totalVotes} / {hist.maxVotes} Votes
                            </span>
                          </div>

                          <div className="text-xs text-slate-300 font-mono flex items-center justify-between border-t border-white/5 pt-2">
                            <span>
                              Result: {hist.isTie ? <strong className="text-amber-400">Historic Tie</strong> : <strong className="text-emerald-400">{hist.winnerName} ({hist.winnerVotes} votes)</strong>}
                            </span>
                            <span className="text-slate-500 text-[11px]">{hist.completedAt || hist.startedAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: TESTING & SIMULATOR TOOLS */}
              {activeTab === 'tools' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Quick Election Test Simulator
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Conveniently test live vote increments, tie scenarios, and the {maxVotes}th vote completion without typing separate IDs.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                      <button
                        onClick={() => simulateQuickVotes(1)}
                        disabled={isCompleted}
                        className="p-4 rounded-xl bg-black/60 hover:bg-white/5 border border-white/5 text-left transition-all disabled:opacity-50 cursor-pointer"
                        id="sim-vote-1-btn"
                      >
                        <div className="font-bold text-xs text-white">Cast +1 Test Vote</div>
                        <div className="text-[11px] text-slate-500 mt-1">Adds a single valid 138-ID vote</div>
                      </button>

                      <button
                        onClick={() => simulateQuickVotes(5)}
                        disabled={isCompleted}
                        className="p-4 rounded-xl bg-black/60 hover:bg-white/5 border border-white/5 text-left transition-all disabled:opacity-50 cursor-pointer"
                        id="sim-vote-5-btn"
                      >
                        <div className="font-bold text-xs text-white">Cast +5 Test Votes</div>
                        <div className="text-[11px] text-slate-500 mt-1">Adds batch of 5 distributed votes</div>
                      </button>

                      <button
                        onClick={() => {
                          const needed = (maxVotes - 1) - totalVotes;
                          if (needed > 0) simulateQuickVotes(needed, 'balanced');
                        }}
                        disabled={isCompleted || totalVotes >= maxVotes - 1}
                        className="p-4 rounded-xl bg-black/60 hover:bg-white/5 border border-white/5 text-left transition-all disabled:opacity-50 cursor-pointer"
                        id="sim-fast-forward-99-btn"
                      >
                        <div className="font-bold text-xs text-amber-300">Fast-Forward to {maxVotes - 1} Votes</div>
                        <div className="text-[11px] text-slate-500 mt-1">Prepares for final {maxVotes}th vote test</div>
                      </button>

                      <button
                        onClick={() => {
                          const needed = maxVotes - totalVotes;
                          if (needed > 0) simulateQuickVotes(needed, 'c1');
                        }}
                        disabled={isCompleted}
                        className="p-4 rounded-xl bg-black/60 hover:bg-white/5 border border-white/5 text-left transition-all disabled:opacity-50 cursor-pointer"
                        id="sim-complete-c1-btn"
                      >
                        <div className="font-bold text-xs text-emerald-400">Complete (Candidate 1 Win)</div>
                        <div className="text-[11px] text-slate-500 mt-1">Fills up to {maxVotes} with Candidate 1 ahead</div>
                      </button>

                      <button
                        onClick={() => {
                          const needed = maxVotes - totalVotes;
                          if (needed > 0) simulateQuickVotes(needed, 'c2');
                        }}
                        disabled={isCompleted}
                        className="p-4 rounded-xl bg-black/60 hover:bg-white/5 border border-white/5 text-left transition-all disabled:opacity-50 cursor-pointer"
                        id="sim-complete-c2-btn"
                      >
                        <div className="font-bold text-xs text-blue-400">Complete (Candidate 2 Win)</div>
                        <div className="text-[11px] text-slate-500 mt-1">Fills up to {maxVotes} with Candidate 2 ahead</div>
                      </button>

                      <button
                        onClick={async () => {
                          await resetElectionData();
                          const half = Math.floor(maxVotes / 2);
                          setTimeout(async () => {
                            await simulateQuickVotes(half, 'c1');
                            setTimeout(async () => {
                              await simulateQuickVotes(half, 'c2');
                            }, 500);
                          }, 500);
                        }}
                        className="p-4 rounded-xl bg-black/60 hover:bg-white/5 border border-white/5 text-left transition-all cursor-pointer"
                        id="sim-simulate-tie-btn"
                      >
                        <div className="font-bold text-xs text-amber-400">Simulate 50-50 Tie ({maxVotes} Votes)</div>
                        <div className="text-[11px] text-slate-500 mt-1">Tests tie announcement screen</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* CONFIRMATION MODAL FOR RESET ELECTION */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="text-center">
                <h4 className="text-lg font-bold text-white uppercase tracking-wider">Start New Election?</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  This will archive the current <strong className="text-white">{totalVotes} cast votes</strong> to history, clear all active student voting records in Firebase, reset candidate tallies to 0, and reactivate the voting portal.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 space-y-1 font-mono">
                <p>✓ Candidate 1: 0 votes</p>
                <p>✓ Candidate 2: 0 votes</p>
                <p>✓ Total: 0 / {maxVotes} votes</p>
                <p>✓ Archived to Election History</p>
                <p>✓ All student IDs can vote again</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-bold uppercase tracking-wider text-xs border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteReset}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-red-600/30 cursor-pointer"
                  id="confirm-reset-election-btn"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
