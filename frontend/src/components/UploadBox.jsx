import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api';

const UploadBox = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setError(null);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF, JPG, or PNG.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsUploading(false);
      if (onUploadSuccess) onUploadSuccess(response.data);
    } catch (err) {
      setIsUploading(false);
      setError(err.response?.data?.detail || 'Failed to upload report.');
    }
  };

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 cursor-pointer overflow-hidden ${
          isDragging 
            ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.15)]' 
            : error 
              ? 'border-rose-500/30 bg-rose-500/5' 
              : 'border-slate-700 bg-slate-900/50 hover:border-blue-500/50 hover:bg-slate-800/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
        />

        {/* Background glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] transition-all duration-700 ${
            isDragging ? 'bg-blue-500/20 scale-150' : 'bg-blue-500/5 scale-100'
          }`} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={isDragging ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`p-5 rounded-2xl mb-5 ${isDragging ? 'bg-blue-500/20 shadow-lg shadow-blue-500/20' : 'bg-slate-800 border border-slate-700'}`}
          >
            <UploadCloud className={`w-8 h-8 transition-colors ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2 font-outfit">
            {isDragging ? 'Drop your file here' : 'Upload Medical Report'}
          </h3>
          <p className="text-slate-500 mb-6 max-w-sm text-sm">
            Drag & drop your PDF, JPG, or PNG file, or click to browse
          </p>
          
          <motion.button 
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-7 py-3 rounded-xl font-medium hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Browse Files
          </motion.button>

          <div className="flex items-center gap-4 mt-5">
            {['PDF', 'JPG', 'PNG'].map((type) => (
              <span key={type} className="text-xs text-slate-600 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">{type}</span>
            ))}
          </div>
        </div>

        {/* Upload progress overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-2xl"
            >
              <div className="relative w-20 h-20 mb-4">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 24 24">
                  <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  <circle className="text-blue-500" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"
                    strokeDasharray="62.83"
                    strokeDashoffset="15"
                    strokeLinecap="round"
                  />
                </svg>
                <UploadCloud className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="font-semibold text-white mb-1">Uploading...</p>
              <p className="text-sm text-slate-400">Processing file securely</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-3 text-rose-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadBox;
