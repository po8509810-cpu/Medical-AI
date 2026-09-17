import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Circle } from 'lucide-react';

const ProgressTimeline = ({ currentStage }) => {
  const stages = [
    { id: 'upload', label: 'Upload complete', icon: '📤' },
    { id: 'validate', label: 'File validated', icon: '✓' },
    { id: 'extract', label: 'Text extracted', icon: '📄' },
    { id: 'ocr', label: 'OCR completed', icon: '🔍' },
    { id: 'detect', label: 'Laboratory elements detected', icon: '🧪' },
    { id: 'normalize', label: 'Values normalized', icon: '📊' },
    { id: 'reference', label: 'Reference ranges analyzed', icon: '📏' },
    { id: 'risk', label: 'Running risk assessment', icon: '⚠️' },
    { id: 'rag', label: 'Retrieving medical information', icon: '🧠' },
    { id: 'explain', label: 'Generating explanation', icon: '💡' },
    { id: 'finalize', label: 'Finalizing report', icon: '✅' },
  ];

  const getStageStatus = (index, currentIndex) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  const currentIndex = stages.findIndex(s => s.id === currentStage);
  const activeIndex = currentIndex === -1 ? stages.length : currentIndex;
  
  const progressPercentage = Math.round((activeIndex / stages.length) * 100);

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-bold text-white font-outfit">Analysis Progress</h3>
          <p className="text-slate-500 text-sm mt-1">AI is analyzing your report</p>
        </div>
        <div className="text-right">
          <motion.span
            key={progressPercentage}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold font-outfit gradient-text-blue"
          >
            {progressPercentage}%
          </motion.span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-8 overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 h-2 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 animate-shimmer" />
        </motion.div>
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const status = getStageStatus(index, activeIndex);
          
          return (
            <motion.div 
              key={stage.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center space-x-4 px-3 py-2 rounded-xl transition-all duration-300 ${
                status === 'current' ? 'bg-blue-500/10 border border-blue-500/20' :
                status === 'completed' ? '' :
                'opacity-30'
              }`}
            >
              <div className="relative flex items-center justify-center w-7 h-7">
                {status === 'completed' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </motion.div>
                )}
                {status === 'current' && (
                  <div className="relative">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    <div className="absolute inset-0 w-5 h-5 rounded-full bg-blue-400/20 animate-ping" />
                  </div>
                )}
                {status === 'pending' && (
                  <Circle className="w-4 h-4 text-slate-700" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                status === 'completed' ? 'text-slate-400' :
                status === 'current' ? 'text-blue-300' : 'text-slate-600'
              }`}>
                {stage.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTimeline;
