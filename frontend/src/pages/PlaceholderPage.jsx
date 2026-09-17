import React from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Construction, FileText, Activity, History, Sparkles, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const PlaceholderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  let title = "Under Construction";
  let description = "This section is currently being built.";
  let Icon = Construction;
  let gradient = 'from-slate-600 to-slate-700';

  if (path === '/reports') {
    title = "Complete Report Data";
    description = "This section will display all extracted laboratory elements, reference ranges, and extraction confidence scores. Currently, no reports are fully processed.";
    Icon = FileText;
    gradient = 'from-blue-500 to-blue-700';
  } else if (path === '/analytics') {
    title = "Analytics & Trends";
    description = "This section will show interactive charts comparing your past reports and identifying health trends over time. Upload more reports to enable analytics.";
    Icon = Activity;
    gradient = 'from-cyan-500 to-cyan-700';
  } else if (path === '/history') {
    title = "Patient History";
    description = "Your complete timeline of uploaded reports and automated risk assessments will appear here.";
    Icon = History;
    gradient = 'from-purple-500 to-purple-700';
  }

  return (
    <div className="flex min-h-screen bg-slate-950 font-inter">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="glass-card p-14 rounded-3xl max-w-2xl w-full relative overflow-hidden"
        >
          {/* Background orb */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px]" />
          
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
          >
            <Icon className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-4 font-outfit">{title}</h2>
          
          <div className="glass-light rounded-2xl p-6 mb-8">
            <p className="text-sm text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-600 text-xs mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI processing pipeline under active development</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-blue-400"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};

export default PlaceholderPage;
