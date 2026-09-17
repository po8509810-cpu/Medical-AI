import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, FileText, ChevronRight, Sparkles, Zap, Brain, ArrowRight, HeartPulse, BarChart3, MessageSquare, Lock } from 'lucide-react';

/* ---- Lightweight CSS-only background (no JS particles) ---- */
const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Gradient orbs — CSS animations, GPU accelerated */}
    <div className="absolute top-[-15%] left-[-8%] w-[500px] h-[500px] bg-blue-600/[0.12] rounded-full blur-[120px] animate-float" />
    <div className="absolute bottom-[-15%] right-[-5%] w-[450px] h-[450px] bg-indigo-500/[0.10] rounded-full blur-[120px] animate-float-reverse" />
    <div className="absolute top-[50%] left-[50%] w-[350px] h-[350px] bg-cyan-500/[0.06] rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />

    {/* Subtle grid */}
    <div className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage: `linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }}
    />

    {/* Radial spotlight */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-500/[0.07] to-transparent rounded-full blur-[60px]" />
  </div>
);

/* ---- Animated DNA Helix ---- */
const DNAHelix = () => {
  const strands = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  return (
    <div className="relative w-16 h-48 mx-auto">
      {strands.map((i) => {
        const y = (i / 12) * 100;
        const delay = i * 0.12;
        const xOffset = Math.sin((i / 12) * Math.PI * 2) * 20;
        return (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              top: `${y}%`,
              left: `calc(50% + ${xOffset}px)`,
              background: i % 2 === 0 ? 'rgba(59,130,246,0.6)' : 'rgba(6,182,212,0.6)',
            }}
            animate={{
              x: [xOffset, -xOffset, xOffset],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity, delay, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
};

/* ---- Feature Card ---- */
const FeatureCard = ({ icon: Icon, title, description, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay }}
    className="glass-card glass-card-hover rounded-2xl p-7 group cursor-default relative overflow-hidden"
  >
    <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} />
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${gradient} shadow-lg`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2 font-outfit">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

/* ---- How-It-Works Step ---- */
const StepItem = ({ number, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    className="flex items-start gap-5 group"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm font-outfit shadow-lg glow-blue group-hover:scale-110 transition-transform">
      {number}
    </div>
    <div>
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

/* ---- Main Landing ---- */
const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden relative font-inter">
      <HeroBackground />

      {/* ---- Navbar ---- */}
      <nav className="relative z-10 px-6 md:px-8 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-3">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-xl shadow-lg glow-blue">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <span className="text-lg font-bold font-outfit tracking-tight">MEDICAL <span className="gradient-text-blue">AI</span></span>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-3">
          <button onClick={() => navigate('/features')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium hidden sm:block px-3 py-2">Features</button>
          <button onClick={() => navigate('/chat')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium hidden sm:block px-3 py-2">AI Chat</button>
          <button onClick={() => navigate('/dashboard')} className="text-sm font-medium bg-white/[0.06] hover:bg-white/[0.1] text-white px-5 py-2.5 rounded-xl transition-all border border-white/[0.08] hover:border-white/[0.15]">
            Dashboard →
          </button>
        </motion.div>
      </nav>

      {/* ---- Hero Section ---- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-12 md:pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center space-x-2 glass-light px-4 py-2 rounded-full text-sm mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300">AI-Powered Medical Analysis</span>
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-outfit tracking-tight mb-6 leading-[1.08]"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Understand your{' '}
              <span className="gradient-text">lab reports</span>{' '}
              in seconds.
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-slate-400 max-w-xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Upload your medical reports and get instant AI-powered risk assessments,
              source-grounded explanations, and personalized nutrition plans.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="group relative flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-[0_4px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_45px_rgba(37,99,235,0.5)] hover:brightness-110 active:scale-[0.98]"
              >
                <Zap className="w-5 h-5 mr-2" />
                Analyze My Report
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center justify-center glass-light hover:bg-white/[0.08] text-slate-300 px-8 py-4 rounded-2xl font-medium transition-all active:scale-[0.98]"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat with AI
              </button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 text-xs text-slate-500"
            >
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> End-to-end encrypted</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> HIPAA-aware design</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Real-time analysis</span>
            </motion.div>
          </div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              {/* Outer ring */}
              <div className="w-80 h-80 rounded-full border border-slate-800/50 flex items-center justify-center animate-float">
                {/* Inner ring */}
                <div className="w-60 h-60 rounded-full border border-slate-700/30 flex items-center justify-center relative">
                  {/* Center */}
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-500/10 flex items-center justify-center neon-border-blue animate-pulse-glow">
                    <HeartPulse className="w-14 h-14 text-blue-400 animate-heartbeat" />
                  </div>

                  {/* Orbiting icons */}
                  {[
                    { Icon: Brain, angle: 0, color: 'from-purple-500 to-purple-700' },
                    { Icon: BarChart3, angle: 90, color: 'from-cyan-500 to-cyan-700' },
                    { Icon: FileText, angle: 180, color: 'from-blue-500 to-blue-700' },
                    { Icon: Shield, angle: 270, color: 'from-emerald-500 to-emerald-700' },
                  ].map(({ Icon, angle, color }, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const x = Math.cos(rad) * 110;
                    const y = Math.sin(rad) * 110;
                    return (
                      <motion.div
                        key={i}
                        className={`absolute w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                        style={{ left: `calc(50% + ${x}px - 22px)`, top: `calc(50% + ${y}px - 22px)` }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Scan line */}
              <div className="absolute inset-0 overflow-hidden rounded-full opacity-20 pointer-events-none">
                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                  style={{ animation: 'scan-line 4s ease-in-out infinite' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- Stats Bar ---- */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl px-8 py-7 grid grid-cols-3 divide-x divide-slate-800/50"
        >
          {[
            { value: '99.2%', label: 'OCR Accuracy' },
            { value: '<30s', label: 'Analysis Speed' },
            { value: '50+', label: 'Biomarkers' },
          ].map((stat, i) => (
            <div key={i} className="text-center px-4">
              <p className="text-2xl md:text-3xl font-bold font-outfit gradient-text-blue">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ---- Features Grid ---- */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-3 block">Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white">Everything you need to <span className="gradient-text">understand your health</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard icon={FileText} title="Smart Extraction" description="Instantly extracts all analytes, values, and reference ranges from PDFs or images using advanced OCR." gradient="from-blue-500/20 to-blue-600/5" delay={0} />
          <FeatureCard icon={BarChart3} title="Risk Assessment" description="ML models flag abnormal values and calculate comprehensive risk scores across all biomarkers." gradient="from-cyan-500/20 to-cyan-600/5" delay={0.08} />
          <FeatureCard icon={Shield} title="Grounded Explanations" description="RAG architecture provides explanations backed by cited, trusted medical literature." gradient="from-emerald-500/20 to-emerald-600/5" delay={0.16} />
          <FeatureCard icon={MessageSquare} title="AI Chat Assistant" description="Ask questions about your results and get detailed, safe medical information in real-time." gradient="from-purple-500/20 to-purple-600/5" delay={0.08} />
          <FeatureCard icon={HeartPulse} title="Nutrition Plans" description="Personalized 30-day nutrition & routine plans generated from your profile and health data." gradient="from-rose-500/20 to-rose-600/5" delay={0.16} />
          <FeatureCard icon={Brain} title="Trend Analysis" description="Track biomarker changes over time and identify patterns with side-by-side report comparison." gradient="from-amber-500/20 to-amber-600/5" delay={0.24} />
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3 block">How it works</span>
          <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white">From upload to insight in <span className="gradient-text-blue">3 steps</span></h2>
        </motion.div>

        <div className="glass-card rounded-2xl p-8 md:p-10 space-y-8">
          <StepItem number="1" title="Upload your report" desc="Drag & drop a PDF, JPG, or PNG of your medical lab report. We support all major formats." delay={0} />
          <div className="border-l-2 border-dashed border-slate-800 ml-5 h-4" />
          <StepItem number="2" title="AI analyzes everything" desc="Our pipeline runs OCR, extracts biomarkers, compares against reference ranges, and calculates risk scores." delay={0.1} />
          <div className="border-l-2 border-dashed border-slate-800 ml-5 h-4" />
          <StepItem number="3" title="Get actionable insights" desc="Receive a visual breakdown, chat with the AI about your results, and generate a personalized nutrition plan." delay={0.2} />
        </div>
      </section>

      {/* ---- Bottom CTA ---- */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-[80px]" />

          <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-5" />
          <h2 className="text-3xl font-bold font-outfit text-white mb-4">Ready to understand your health data?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Upload your first report and experience AI-powered medical analysis in seconds.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-10 py-4 rounded-2xl font-semibold shadow-[0_4px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_45px_rgba(37,99,235,0.5)] hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="relative z-10 border-t border-slate-800/50 py-8">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <span>© 2026 Medical AI. All rights reserved.</span>
          <span className="mt-2 md:mt-0">Built with React, Gemini AI & ❤️</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
