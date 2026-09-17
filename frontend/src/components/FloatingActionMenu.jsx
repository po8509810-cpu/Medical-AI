import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, UploadCloud, MessageSquare, ArrowRightLeft, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { name: 'Export PDF', icon: FileDown, gradient: 'from-rose-500 to-pink-600', path: '#' },
    { name: 'Compare', icon: ArrowRightLeft, gradient: 'from-emerald-500 to-teal-600', path: '/compare' },
    { name: 'Ask AI', icon: MessageSquare, gradient: 'from-blue-500 to-indigo-600', path: '/chat' },
    { name: 'Upload', icon: UploadCloud, gradient: 'from-cyan-500 to-blue-600', path: '/dashboard' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-inter">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-16 right-0 mb-2 flex flex-col items-end space-y-2"
            >
              {actions.map((action, i) => (
                <motion.button
                  key={action.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { setIsOpen(false); if (action.path !== '#') navigate(action.path); }}
                  className="flex items-center gap-2.5 glass px-4 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors text-sm text-slate-300 hover:text-white"
                >
                  <span>{action.name}</span>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${action.gradient}`}>
                    <action.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-200 ${
          isOpen ? 'bg-slate-800 rotate-45' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'
        }`}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FloatingActionMenu;
