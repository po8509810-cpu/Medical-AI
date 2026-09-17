import React from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { ArrowRightLeft, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

const Compare = () => {
  const comparisons = [
    { name: 'Glucose', previous: 130, current: 142, unit: 'mg/dL', trend: 'up', status: 'high' },
    { name: 'Hemoglobin', previous: 11.2, current: 10.8, unit: 'g/dL', trend: 'down', status: 'low' },
    { name: 'LDL Cholesterol', previous: 140, current: 150, unit: 'mg/dL', trend: 'up', status: 'high' },
    { name: 'WBC Count', previous: 7.5, current: 7.8, unit: 'x10³/uL', trend: 'neutral', status: 'normal' },
    { name: 'Platelets', previous: 250, current: 245, unit: 'x10³/uL', trend: 'neutral', status: 'normal' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 font-inter">
      <Sidebar />
      <main className="flex-1 ml-72 p-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold font-outfit text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-xl border border-emerald-500/20">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              Report Comparison
            </h1>
            <p className="text-slate-500 mt-2">Side-by-side analysis of your medical laboratory trends.</p>
          </div>
          
          <div className="flex space-x-3">
            <select className="glass-light text-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500/50 text-sm">
              <option>Previous: Sep 12, 2026</option>
              <option>Previous: Jun 05, 2026</option>
            </select>
            <select className="glass-light text-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500/50 text-sm">
              <option>Current: Sep 13, 2026</option>
            </select>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-3 bg-slate-800/30 border-b border-slate-800/50 p-4 font-semibold text-slate-400 text-sm uppercase tracking-wider">
            <div>Test Name</div>
            <div>Previous Report</div>
            <div>Current Report</div>
          </div>
          
          <div className="divide-y divide-slate-800/50">
            {comparisons.map((item, index) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                className="grid grid-cols-3 p-5 items-center transition-all duration-300 group"
              >
                <div className="font-medium text-white flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-blue-400 transition-colors" />
                  {item.name}
                </div>
                
                <div className="text-slate-400 flex items-center gap-2">
                  <span className="text-lg font-medium">{item.previous}</span>
                  <span className="text-xs text-slate-600">{item.unit}</span>
                </div>
                
                <div className="flex items-center justify-between pr-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${
                      item.trend === 'up' && item.status === 'high' ? 'text-rose-400' :
                      item.trend === 'down' && item.status === 'low' ? 'text-rose-400' :
                      'text-white'
                    }`}>
                      {item.current}
                    </span>
                    <span className="text-xs text-slate-600">{item.unit}</span>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={`p-2 rounded-xl border ${
                      item.trend === 'up' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      item.trend === 'down' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
                     item.trend === 'down' ? <TrendingDown className="w-4 h-4" /> :
                     <Minus className="w-4 h-4" />}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 glass-card rounded-xl p-4 flex items-start gap-3"
        >
          <BarChart3 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-400">
            <strong className="text-slate-300">Note:</strong> This is a UI demonstration. Real comparison data will automatically populate once the PDF extraction pipeline is completed.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Compare;
