import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-[#0c0c11]">
      
      {/* Dark Purple Glow */}
      <div className="absolute top-1/2 left-0 w-[1000px] h-[1000px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[420px] flex flex-col items-center"
      >
        <div className="w-full bg-[#181820] rounded-[2rem] p-8 sm:p-10 border border-white/[0.02] shadow-2xl text-center">
          
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-8">
            <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center shadow-sm">
              <Check size={20} className="text-white" strokeWidth={3} />
            </div>
          </div>

          <h1 className="text-[32px] font-extrabold text-white mb-2">Hello!</h1>
          <h2 className="text-lg font-semibold text-white/90 mb-4 leading-tight">
            Welcome to your personal productivity space.
          </h2>
          <p className="text-sm text-slate-400 mb-10">
            Organize your tasks, set priorities, and achieve your goals with ease.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetStarted}
            className="group relative w-full h-14 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
            <span>Get Started</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
