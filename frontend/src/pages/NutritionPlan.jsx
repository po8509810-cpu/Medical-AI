import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Sparkles, RefreshCw, Utensils, Dumbbell, Droplets, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const DayCard = ({ day, isExpanded, onToggle }) => (
  <motion.div
    layout
    className="glass-light rounded-xl overflow-hidden"
  >
    <button
      onClick={onToggle}
      className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
    >
      <h4 className="text-base font-semibold text-white flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-bold border border-blue-500/20">
          {day.day}
        </span>
        Day {day.day}
      </h4>
      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
    </button>
    
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-5 pb-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-xs font-semibold text-blue-400 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" /> Meals
              </h5>
              <ul className="space-y-2">
                {day.meals?.map((meal, mIdx) => (
                  <li key={mIdx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    {meal}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-purple-400 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" /> Routine
              </h5>
              <ul className="space-y-2">
                {day.routine?.map((item, rIdx) => (
                  <li key={rIdx} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const NutritionPlan = () => {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedDays, setExpandedDays] = useState({});
  const navigate = useNavigate();

  const fetchPlan = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8000/api/nutrition/plan`);
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPlan(); }, []);

  const generatePlan = async () => {
    setIsLoading(true);
    setError('');
    setPlan(null);
    try {
      const res = await fetch(`http://${window.location.hostname}:8000/api/nutrition/generate`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPlan(data.plan);
      } else {
        setError(data.detail || 'Failed to generate plan.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (weekIdx, dayIdx) => {
    const key = `${weekIdx}-${dayIdx}`;
    setExpandedDays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex h-screen bg-slate-950 font-inter text-slate-300">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-between items-center"
          >
            <div>
              <h1 className="text-3xl font-bold font-outfit text-white mb-2 flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                AI Nutrition & Routine Plan
              </h1>
              <p className="text-slate-500">Your personalized 30-day wellness journey.</p>
            </div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/nutrition/profile')}
                className="px-5 py-2.5 glass-light text-slate-300 rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                Edit Profile
              </motion.button>
              <motion.button 
                onClick={generatePlan} 
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {isLoading ? 'Generating...' : (plan ? 'Regenerate' : 'Generate Plan')}
              </motion.button>
            </div>
          </motion.header>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-8"
            >
              {error}
            </motion.div>
          )}

          {plan && plan.month && (
            <div className="space-y-6">
              {/* Goals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-outfit">
                  <Activity className="w-5 h-5 text-blue-400" /> Monthly Goals
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.month.goals?.map((goal, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2 text-slate-300 text-sm glass-light rounded-lg px-4 py-3"
                    >
                      <span className="mt-1 w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                      {goal}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Weeks */}
              {plan.month.weeks?.map((week, wIdx) => (
                <motion.div
                  key={wIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + wIdx * 0.1 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold font-outfit text-white mb-5 pb-4 border-b border-slate-800/50">
                    Week {week.week_number}: <span className="gradient-text-blue">{week.focus}</span>
                  </h3>
                  
                  {/* Week summary cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                      { icon: Utensils, label: 'Nutrition', value: week.nutrition_theme },
                      { icon: Dumbbell, label: 'Routine', value: week.routine_focus },
                      { icon: Droplets, label: 'Hydration', value: week.hydration_goal },
                      { icon: Moon, label: 'Sleep', value: week.sleep_focus || week.activity_reminder },
                    ].map((card, i) => (
                      <div key={i} className="glass-light rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <card.icon className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{card.label}</span>
                        </div>
                        <span className="text-slate-300 text-sm">{card.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Day cards */}
                  <div className="space-y-2">
                    {week.days?.map((day, dIdx) => (
                      <DayCard
                        key={dIdx}
                        day={day}
                        isExpanded={expandedDays[`${wIdx}-${dIdx}`]}
                        onToggle={() => toggleDay(wIdx, dIdx)}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!plan && !isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 glass-card rounded-2xl"
            >
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-700">
                <Sparkles className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-outfit">No Plan Generated Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto text-sm">Fill out your Nutrition Profile first, then click "Generate Plan" to get your personalized 30-day journey.</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NutritionPlan;
