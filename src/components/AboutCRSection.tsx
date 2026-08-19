import React from 'react';
import { 
  Users, 
  BookOpen, 
  Code2, 
  MessageSquare, 
  HelpCircle, 
  Sparkles,
  Award
} from 'lucide-react';

export const AboutCRSection: React.FC = () => {
  const duties = [
    {
      title: "Faculty & Student Liaison",
      desc: "Communicating student concerns, scheduling assignment extensions with instructors, and organizing lab slot arrangements.",
      icon: <MessageSquare className="w-5 h-5 text-emerald-400" />
    },
    {
      title: "Hackathons & Coding Circles",
      desc: "Coordinating peer-to-peer coding sessions, group project showcases, and tech workshop series throughout the semester.",
      icon: <Code2 className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Academic Resource Sharing",
      desc: "Managing shared repositories for recorded lectures, assignment sample codes, curated cheat sheets, and study materials.",
      icon: <BookOpen className="w-5 h-5 text-amber-400" />
    },
    {
      title: "Student Welfare & Inclusivity",
      desc: "Ensuring every classmate receives academic guidance, assistance with development tools, and mentorship opportunities.",
      icon: <Award className="w-5 h-5 text-purple-400" />
    }
  ];

  return (
    <section id="about" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Column: Role Details */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] uppercase font-bold text-emerald-400 tracking-[0.2em]">
              <Users className="w-3.5 h-3.5" />
              <span>Student Leadership</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white leading-tight">
              The Role of the <span className="font-bold text-emerald-400 italic">Representative</span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              In the <strong className="text-emerald-400 font-semibold">Bano Qabil IT Initiative</strong>, the Class Representative is the primary democratic voice connecting students with industry mentors, program directors, and instructional staff.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {duties.map((duty, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 transition-all space-y-2 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    {duty.icon}
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{duty.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{duty.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Bano Qabil Vision Card */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 shadow-2xl backdrop-blur-sm relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-black text-lg"
                style={{ background: 'linear-gradient(135deg, #00ff9c, #00897b)' }}
              >
                BQ
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide uppercase text-xs">About Bano Qabil Program</h3>
                <p className="text-xs text-slate-400">Youth IT Empowerment & Skill Development</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bano Qabil is a flagship youth empowerment project providing 100% free IT scholarships in high-demand domains including Web & App Development, Cyber Security, Cloud Computing, AI, and Digital Marketing.
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Election Target:</span>
                <span className="text-emerald-400 font-bold">100 Votes (Batch Cohort)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Validation Rule:</span>
                <span className="text-white font-bold">7 Digits (138 Prefix)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Term of Office:</span>
                <span className="text-white font-bold">2025 - 2026 Academic Year</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
