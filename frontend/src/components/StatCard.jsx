import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => {
  const [count, setCount] = useState(0);

  const getColors = () => {
    if (colorClass?.includes('blue')) return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/15' };
    if (colorClass?.includes('indigo')) return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/15' };
    if (colorClass?.includes('rose')) return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/15' };
    if (colorClass?.includes('amber')) return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/15' };
    return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/15' };
  };

  const colors = getColors();

  useEffect(() => {
    if (typeof value !== 'number' || value === 0) { setCount(value); return; }
    let frame;
    const start = performance.now();
    const duration = 800;
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className="glass-card rounded-xl p-5 hover-lift group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">{title}</p>
          <h3 className="text-2xl font-bold font-outfit text-white">{typeof value === 'number' ? count : value}</h3>
          {trend && (
            <p className="text-[11px] font-semibold mt-2.5 text-emerald-400 bg-emerald-500/[0.08] inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/15">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />{trend}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text} border ${colors.border}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
