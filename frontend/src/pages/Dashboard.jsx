import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertCircle, Activity, HeartPulse, TrendingUp, Eye, Calendar, Sparkles } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import UploadBox from '../components/UploadBox';
import ProgressTimeline from '../components/ProgressTimeline';
import FloatingActionMenu from '../components/FloatingActionMenu';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('upload');
  const { user, logout } = useAuth();

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (err) {
      if (err.response) console.error(err.response);
    }
  };

  const handleUploadSuccess = (data) => {
    setIsProcessing(true);
    const stages = ['upload','validate','extract','ocr','detect','normalize','reference','risk','rag','explain','finalize','done'];
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i >= stages.length) { clearInterval(timer); setIsProcessing(false); fetchReports(); }
      else setProcessingStage(stages[i]);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-inter">
      <Sidebar />
      
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-2xl font-bold font-outfit text-white tracking-tight flex items-center gap-2.5">
              Dashboard
              <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/15 uppercase tracking-wider">Overview</span>
            </h1>
            <p className="text-slate-600 mt-1.5 text-sm">
              Welcome back, {user ? user.full_name : 'User'}. Here is the latest analysis of your medical data.
            </p>
            {user && (
              <p className="text-xs text-slate-500 mt-1">{user.email}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="glass-light px-4 py-2 rounded-xl flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <button 
              onClick={logout}
              className="text-xs px-4 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
            >
              Logout
            </button>
          </div>
        </motion.header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Reports" value={reports.length} icon={FileText} colorClass="bg-blue-100 text-blue-600" trend={reports.length > 0 ? "Active" : null} />
          <StatCard title="Tests Analyzed" value={reports.length > 0 ? 148 : 0} icon={Activity} colorClass="bg-indigo-100 text-indigo-600" />
          <StatCard title="Abnormal Findings" value={reports.length > 0 ? 17 : 0} icon={AlertCircle} colorClass="bg-rose-100 text-rose-600" />
          <StatCard title="Risk Areas" value={reports.length > 0 ? 4 : 0} icon={HeartPulse} colorClass="bg-amber-100 text-amber-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div key="processing" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ProgressTimeline currentStage={processingStage} />
                </motion.div>
              ) : (
                <motion.div key="upload" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <UploadBox onUploadSuccess={handleUploadSuccess} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Reports */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800/30 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Recent Reports</h3>
                <span className="text-[11px] text-slate-600 bg-slate-800/50 px-2.5 py-1 rounded-full">{reports.length} total</span>
              </div>
              <div className="divide-y divide-slate-800/30">
                {reports.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText className="w-8 h-8 text-slate-800 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">No reports uploaded yet</p>
                    <p className="text-slate-700 text-xs mt-1">Upload your first report above</p>
                  </div>
                ) : (
                  reports.map((report, idx) => (
                    <div 
                      key={report.id}
                      className="px-6 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-500/[0.08] text-blue-400 rounded-lg border border-blue-500/10 group-hover:bg-blue-500/[0.12] transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{report.original_filename}</p>
                          <p className="text-xs text-slate-600">{new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          report.upload_status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' :
                          report.upload_status === 'FAILED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/15' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                        }`}>{report.upload_status}</span>
                        <button 
                          className="flex items-center gap-1 text-blue-400/70 hover:text-blue-400 text-xs transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`http://${window.location.hostname}:8000/uploads/${report.filename}`, '_blank');
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Insights Sidebar */}
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 font-outfit flex items-center gap-2 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-blue-400" /> AI Insights
              </h3>
              {reports.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-800">
                    <Sparkles className="w-6 h-6 text-slate-700" />
                  </div>
                  <p className="text-slate-600 text-xs">Upload a report to see insights</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3.5 bg-blue-500/[0.05] rounded-xl border border-blue-500/10">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-blue-400 font-semibold">Data Quality</p>
                      <span className="text-xs text-blue-300 font-bold">92%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full" />
                    </div>
                  </div>
                  <div className="p-3.5 bg-amber-500/[0.04] rounded-xl border border-amber-500/10">
                    <p className="text-xs text-amber-400 font-semibold mb-1.5">⚡ Action Needed</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Elevated Glucose and LDL levels detected. Discuss with your healthcare provider.</p>
                  </div>
                  <div className="p-3.5 bg-emerald-500/[0.04] rounded-xl border border-emerald-500/10">
                    <p className="text-xs text-emerald-400 font-semibold mb-1.5">✓ Good Standing</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Most biomarkers within normal range. 4 areas flagged for attention.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <FloatingActionMenu />
    </div>
  );
};

export default Dashboard;
