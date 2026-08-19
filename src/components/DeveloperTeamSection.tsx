import React from 'react';
import { DEVELOPER_TEAM } from '../data/team';
import { 
  Code2, 
  Github, 
  Linkedin, 
  GraduationCap, 
  BadgeCheck, 
  Terminal,
  ExternalLink
} from 'lucide-react';

export const DeveloperTeamSection: React.FC = () => {
  return (
    <section id="developer-team" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[500px] bg-emerald-500/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] uppercase font-bold text-emerald-400 tracking-[0.2em]">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Engineering & Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">
            PROJECT <span className="font-bold text-emerald-400 italic">DEVELOPER TEAM</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            The software engineers behind the real-time Firebase atomic voting infrastructure for Bano Qabil Class Representative elections.
          </p>
        </div>

        {/* Developer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {DEVELOPER_TEAM.map((developer) => (
            <div
              key={developer.id}
              id={`developer-card-${developer.id}`}
              className="relative rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-xl group hover:translate-y-[-4px] shadow-xl hover:shadow-2xl"
            >
              <div>
                {/* Developer Headshot Container */}
                <div className="relative w-full h-72 sm:h-80 bg-black/40 overflow-hidden border-b border-white/10">
                  <img
                    src={developer.photoUrl}
                    alt={developer.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  {/* Floating ID Badge over Photo */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-black/70 border border-white/20 text-emerald-400 font-mono text-xs font-bold backdrop-blur-md shadow-lg">
                        STUDENT ID: {developer.studentId}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-black/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 backdrop-blur-md shadow-lg">
                      <BadgeCheck className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-7 space-y-4">
                  {/* Name & Role */}
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                      {developer.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-mono font-semibold uppercase tracking-wider mt-1">
                      Role: {developer.role}
                    </p>
                  </div>

                  {/* Program Details */}
                  <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300">
                    <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Program</span>
                      <span className="font-medium text-slate-100 leading-snug">{developer.program}</span>
                    </div>
                  </div>

                  {/* Skills Section (if present) */}
                  {developer.skills && developer.skills.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <Terminal className="w-3 h-3 text-emerald-400" />
                        <span>Core Technical Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {developer.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bio (if present) */}
                  {developer.bio && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {developer.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer with Social Links */}
              <div className="p-6 pt-3 border-t border-white/5 flex items-center justify-between gap-3 mt-auto">
                <div className="flex items-center gap-2">
                  {developer.githubUrl && (
                    <a
                      href={developer.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black text-slate-300 border border-white/10 transition-all flex items-center gap-1.5 text-xs font-mono group/btn cursor-pointer"
                      title={`${developer.name}'s GitHub Profile`}
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">GitHub</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100" />
                    </a>
                  )}

                  {developer.linkedinUrl && (
                    <a
                      href={developer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300 border border-white/10 transition-all flex items-center gap-1.5 text-xs font-mono group/btn cursor-pointer"
                      title={`${developer.name}'s LinkedIn Profile`}
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">LinkedIn</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100" />
                    </a>
                  )}

                  {!developer.githubUrl && !developer.linkedinUrl && (
                    <span className="text-[11px] font-mono text-slate-500">
                      Bano Qabil Cohort
                    </span>
                  )}
                </div>

                <span className="text-[10px] uppercase tracking-widest font-mono text-slate-600 font-bold">
                  Bano Qabil
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

