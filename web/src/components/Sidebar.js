import React from 'react';
import { motion } from 'framer-motion';
import { List, Layout, LogOut, Moon, Sun, CheckCircle2, ClipboardList } from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onLogout,
  stats,
  selectedCategory,
  setSelectedCategory
}) {
  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: ClipboardList }
  ];

  return (
    <div className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-white dark:bg-zinc-900 border-r border-slate-100 dark:border-zinc-800 p-6 z-30">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <CheckCircle2 size={24} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">ToDoList</h1>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 px-2">Navigation</p>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div key={tab.id} className="space-y-1">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all",
                  activeTab === tab.id
                    ? "bg-indigo-50 dark:bg-primary/10 text-primary shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                )}
              >
                <Icon size={18} opacity={activeTab === tab.id ? 1 : 0.5} />
                {tab.label}
              </button>
              
              {tab.id === 'tasks' && activeTab === 'tasks' && (
                <div className="pl-11 pr-2 py-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  {['ALL', 'WORK', 'PERSONAL', 'SHOPPING', 'OTHER'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={clsx(
                        "w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200",
                        selectedCategory === cat
                          ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                          : "text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {cat === 'ALL' ? 'All Tasks' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        {/* Compact Stats for Sidebar */}
        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800">
           <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Tasks Done</p>
           <div className="flex items-end justify-between mb-1">
              <span className="text-xl font-bold text-slate-700 dark:text-zinc-200">{stats.completed}</span>
              <span className="text-xs text-slate-400">/ {stats.total}</span>
           </div>
           <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.completed / Math.max(1, stats.total)) * 100}%` }}
                className="h-full bg-primary"
              />
           </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex-1 h-12 flex items-center justify-center bg-slate-50 dark:bg-zinc-800/50 text-slate-600 dark:text-zinc-300 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all border border-slate-100 dark:border-zinc-800"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={onLogout}
            className="flex-1 h-12 flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-red-100 dark:border-red-500/10"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
