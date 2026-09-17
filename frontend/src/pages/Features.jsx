import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, HeartPulse, MessageSquare, ArrowLeft, Sparkles, ArrowRight, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    icon: Upload,
    title: '1. Upload',
    description: 'Securely upload your laboratory PDF or image. The system validates the file and queues it for the AI processing engine.',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    icon: Search,
    title: '2. OCR & Extract',
    description: 'Advanced parsing and optical character recognition extracts every analyte, value, unit, and reference range from the raw document.',
    color: 'cyan',
    gradient: 'from-cyan-500 to-cyan-700',
  },
  {
    icon: HeartPulse,
    title: '3. Risk Analysis',
    description: 'Values are normalized and compared against reference ranges. Machine learning models assess potential health risks autonomously.',
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: MessageSquare,
    title: '4. RAG Chatbot',
    description: 'Retrieval-Augmented Generation grounds explanations in cited medical literature, letting you chat safely about your results.',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-700',
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative font-inter overflow-hidden noise">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] animate-float-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] animate-float" />
        
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(148, 163, 184, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <nav className="relative z-10 px-8 py-6 max-w-7xl mx-auto">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </motion.button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-32">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full text-sm mb-6"
          >
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400">Intelligent Pipeline</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-outfit mb-6"
          >
            How Medical AI <span className="gradient-text">Works</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            A fully automated pipeline from raw PDF extraction to intelligent medical explanations.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="glass-card glass-card-hover rounded-2xl p-8 relative overflow-hidden group"
            >
              {/* Corner glow */}
              <div className={`absolute -top-16 -right-16 w-40 h-40 bg-${step.color}-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Step number */}
              <div className="absolute top-6 right-6 text-6xl font-bold font-outfit text-slate-800/50 group-hover:text-slate-700/50 transition-colors">
                {index + 1}
              </div>
              
              <div className={`bg-gradient-to-br ${step.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold font-outfit mb-3 text-white">{step.title}</h4>
              <p className="text-slate-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Try It Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};

export default Features;
