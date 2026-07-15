import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Inbox } from 'lucide-react';

export default function RequestsView({ requests, onAccept, onDecline }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl relative z-10"
    >
      <div className="flex flex-col items-center lg:items-start mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-black text-[#7C4DFF] tracking-tight dark:drop-shadow-md mb-2">Pending Invites</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Tasks you've been invited to collaborate on.</p>
      </div>

      <div className="space-y-4 max-w-3xl">
        <AnimatePresence mode='popLayout'>
          {requests.map((req) => (
            <motion.div
              key={req.task_id || req.taskId}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm border border-slate-100 dark:border-zinc-800"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-1">{req.task_title || `Task #${req.task_id}`}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Invited by <span className="font-bold text-[#7c3aed]">{req.creator_name || 'Someone'}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onDecline(req)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"
                >
                  <X size={16} strokeWidth={3} /> Decline
                </button>
                <button
                  onClick={() => onAccept(req)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 transition-colors"
                >
                  <Check size={16} strokeWidth={3} /> Accept
                </button>
              </div>
            </motion.div>
          ))}
          {requests.length === 0 && (
            <div className="text-center py-20 text-slate-300">
              <Inbox size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold text-lg text-slate-400">No pending invitations.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
