import React, { useState } from 'react';
import { 
  HelpCircle, 
  Mail, 
  Send, 
  CheckCircle2, 
  Phone, 
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setStudentId('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-3 text-[10px] uppercase font-bold text-emerald-400 tracking-[0.2em]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            Commission <span className="font-bold text-emerald-400 italic">Helpdesk</span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Encountering student ID verification issues or have electoral questions? Reach out to the supervision team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Help Contact Cards */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 space-y-2 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Electoral Support Email</h4>
              <p className="text-xs text-slate-400">elections@banoqabil.edu.pk</p>
              <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">Response within 2 hours</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 space-y-2 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Main Campus IT Wing</h4>
              <p className="text-xs text-slate-400">Student Affairs & Lab Coordination Desk, 2nd Floor</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 space-y-2 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Operating Hours</h4>
              <p className="text-xs text-slate-400">9:00 AM — 6:00 PM (Active until 100 votes reached)</p>
            </div>
          </div>

          {/* Quick Support Ticket Form */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
            <h3 className="text-base font-bold text-white tracking-wide uppercase text-xs mb-2">Submit an Inquiry</h3>
            <p className="text-xs text-slate-400 mb-6">
              Our student coordination team will review your query and assist with your ID or receipt verification.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Inquiry Received</h4>
                <p className="text-xs text-slate-300">
                  Thank you! An election commissioner will verify your details and get back to you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Bilal Khan"
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Student ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      placeholder="e.g. 1384021"
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Your Message / Question
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your question or issue regarding the CR election..."
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-white text-black hover:bg-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-white/5 transition-all"
                  id="contact-submit-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Helpdesk Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
