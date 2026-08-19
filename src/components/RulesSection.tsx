import React from 'react';
import { MAX_TOTAL_VOTES } from '../types';
import { 
  ShieldCheck, 
  Hash, 
  Users, 
  Lock, 
  Trophy, 
  AlertCircle,
  FileCheck2,
  Clock
} from 'lucide-react';

export const RulesSection: React.FC = () => {
  const rules = [
    {
      icon: <Hash className="w-6 h-6 text-emerald-400" />,
      title: "Valid 7-Digit Student ID (138 Prefix)",
      desc: "Voters must possess an authentic Bano Qabil 7-digit ID strictly starting with '138' (e.g., 1384021). Other ID structures are rejected."
    },
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      title: "One Student, One Vote",
      desc: "Each registered student ID is permitted to cast exactly one ballot. Duplicate submissions with the same student ID are automatically blocked."
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      title: `${MAX_TOTAL_VOTES} Total Vote Hard Cap`,
      desc: `The election operates on a strict maximum capacity of exactly ${MAX_TOTAL_VOTES} votes. Voting buttons lock immediately once the 100th vote is cast.`
    },
    {
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      title: "Automated Winner / Tie Declaration",
      desc: "Upon recording the 100th vote, the system automatically tallies results, plays celebration fanfare, and declares the winner or tie."
    },
    {
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      title: "Secret & Cryptographic Ballot",
      desc: "Your chosen candidate is encrypted, generating an anonymous digital receipt hash for self-verification while preserving voter privacy."
    },
    {
      icon: <FileCheck2 className="w-6 h-6 text-teal-400" />,
      title: "Self-Service Vote Verification",
      desc: "Students can verify their voting status at any time by entering their 7-digit ID in the top navigation 'Check Vote Status' portal."
    }
  ];

  return (
    <section id="rules" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-3 text-[10px] uppercase font-bold text-emerald-400 tracking-[0.2em]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Electoral Integrity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            Election <span className="font-bold text-emerald-400 italic">Protocols</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Guaranteed transparency, democratic fairness, and strict {MAX_TOTAL_VOTES}-vote limit enforcement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 shadow-xl space-y-3 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center">
                {rule.icon}
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">{rule.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>

        {/* Highlight Note */}
        <div className="mt-10 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 max-w-3xl mx-auto flex items-center gap-3.5 text-xs text-slate-300 backdrop-blur-sm">
          <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">Official Notice:</strong> All student ID validations and vote receipts are recorded strictly for election audit verification. The system administrator cannot alter individual cast ballots without a complete election reset.
          </span>
        </div>

      </div>
    </section>
  );
};
