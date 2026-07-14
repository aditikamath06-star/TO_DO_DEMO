import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressDashboard({ completed, total }) {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const motivation = total === 0
    ? "Start your journey today! 🌟"
    : completed === total
    ? "Victory! You're on fire! 🔥🏆"
    : progress >= 50
    ? "Halfway mark passed! Keep going! 🚀"
    : "Let's turn those goals into tasks! ✨";

  return (
    <div className="w-full bg-gradient-to-br from-indigo-600 to-sky-400 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-500/20 mb-8 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 font-medium mb-1">Weekly Progress</p>
          <h3 className="text-3xl font-bold mb-4">{completed} of {total} Tasks</h3>
          <p className="text-white/90 text-sm leading-relaxed max-w-[200px]">{motivation}</p>
        </div>

        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="transparent"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              fill="transparent"
              stroke="white"
              strokeWidth="8"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xl font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
