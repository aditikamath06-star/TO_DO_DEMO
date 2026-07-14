import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar } from 'lucide-react';

export default function AddTaskModal({ onClose, onSubmit, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState(initialData?.priority || 'MEDIUM');
  const [category, setCategory] = useState(initialData?.category || 'WORK');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      id: initialData?.id || Date.now(),
      title,
      description,
      priority,
      category,
      dueDate,
      completed: initialData?.completed || false,
      createdAt: initialData?.createdAt || Date.now()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{initialData ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary">Add new task</label>
            <input
              autoFocus
              placeholder="e.g. Design new landing page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-14 px-4 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary">Description</label>
            <textarea
              placeholder="Add more details..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-primary">Priority Level</label>
            <div className="flex gap-3">
              {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 h-12 rounded-xl font-bold text-xs transition-all ${
                    priority === p
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-primary">Category</label>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
              {['WORK', 'PERSONAL', 'SHOPPING', 'EDUCATION', 'OTHER'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-4 h-10 rounded-xl font-bold text-[10px] whitespace-nowrap transition-all ${
                    category === c
                      ? 'bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary">Due Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 pb-4 sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 border border-slate-200 dark:border-zinc-800 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all"
            >
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
