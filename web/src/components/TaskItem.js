import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Check, Calendar, Edit2 } from 'lucide-react';
import { clsx } from 'clsx';

const priorityColors = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-amber-400',
  LOW: 'bg-green-500'
};

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: task.completed ? 0.7 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white dark:bg-zinc-900 rounded-3xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all mb-3 overflow-hidden border border-slate-100 dark:border-zinc-800"
    >
      {/* Priority Indicator */}
      <div className={clsx("absolute left-0 top-0 bottom-0 w-2", priorityColors[task.priority])}></div>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={clsx(
          "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
          task.completed
            ? "bg-primary border-primary text-white"
            : "border-slate-300 dark:border-zinc-700 text-transparent"
        )}
      >
        <Check size={14} strokeWidth={4} />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={clsx(
          "font-semibold text-slate-800 dark:text-zinc-100 truncate transition-all",
          task.completed && "line-through text-slate-400 dark:text-zinc-600"
        )}>
          {task.title}
        </h4>
        {task.description && (
          <p className={clsx(
            "text-sm text-slate-500 dark:text-zinc-500 line-clamp-2 mt-1",
            task.completed && "text-slate-300 dark:text-zinc-700"
          )}>
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {/* Category Chip */}
          <span className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-[10px] font-bold text-slate-500 dark:text-zinc-400 rounded-lg uppercase tracking-wider">
            {task.category}
          </span>

          {/* Date Chip */}
          {task.dueDate && (
            <div className={clsx(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium",
              isOverdue ? "bg-red-50 text-red-500" : "bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500"
            )}>
              <Calendar size={10} />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-slate-300 hover:text-primary transition-colors"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
