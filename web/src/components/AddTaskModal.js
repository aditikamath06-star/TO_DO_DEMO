import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar } from 'lucide-react';

export default function AddTaskModal({ onClose, onSubmit, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState(initialData?.priority || 'MEDIUM');
  const [category, setCategory] = useState(initialData?.category || 'WORK');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [collaborators, setCollaborators] = useState(initialData?.collaborators?.join(', ') || '');
  // Calculate local date string for 'min' attribute
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDateString = `${yyyy}-${mm}-${dd}`;
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
      createdAt: initialData?.createdAt || Date.now(),
      collaborators: collaborators.split(',').map(c => c.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full max-w-lg bg-white dark:bg-[#181820] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar border border-transparent dark:border-white/5"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{initialData ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#7c3aed]">Add new task</label>
            <input
              autoFocus
              placeholder="e.g. Design new landing page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-14 px-4 bg-white dark:bg-[#20202a] border border-[#7c3aed] rounded-xl focus:ring-1 focus:ring-[#7c3aed] outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between">
              Collaborators (Emails, comma separated)
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </label>
            <input
              placeholder="e.g. aditi@gmail.com, john@doe.com"
              value={collaborators}
              onChange={(e) => setCollaborators(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:border-slate-300 dark:focus:border-white/20 outline-none transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#7c3aed]">Description</label>
            <textarea
              placeholder="Add more details..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-[#20202a] border-none rounded-xl focus:ring-1 focus:ring-[#7c3aed]/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[#7c3aed]">Priority Level</label>
            <div className="flex gap-3">
              {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 h-12 rounded-xl font-bold text-xs transition-all ${
                    priority === p
                      ? 'bg-[#7c3aed] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                      : 'bg-slate-50 dark:bg-[#20202a] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2a35]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[#7c3aed]">Category</label>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
              {['WORK', 'PERSONAL', 'SHOPPING', 'EDUCATION', 'OTHER'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-4 h-10 rounded-full font-bold text-[10px] whitespace-nowrap transition-all ${
                    category === c
                      ? 'bg-[#181820] text-white dark:bg-white dark:text-black'
                      : 'bg-slate-50 dark:bg-[#20202a] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2a35]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#7c3aed]">Due Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="date"
                min={minDateString}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-[#20202a] border-none rounded-xl focus:ring-1 focus:ring-[#7c3aed]/50 outline-none transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 pb-4 sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-14 bg-[#7c3aed] text-white rounded-2xl font-bold hover:bg-[#6d28d9] transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
            >
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
