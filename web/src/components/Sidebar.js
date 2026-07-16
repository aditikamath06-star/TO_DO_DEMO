import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ClipboardList, Inbox, Settings as SettingsIcon } from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar({
  activeTab,
  setActiveTab,
  stats,
  selectedCategory,
  setSelectedCategory,
  pendingCount = 0,
  user
}) {
  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'requests', label: 'Requests', icon: Inbox },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-[#13131a] border-r border-slate-100 dark:border-white/5 p-4 z-30 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 px-2 mt-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]">
          <CheckCircle2 size={18} />
        </div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">ToDoList</h1>
      </div>

      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-white/10">
          {user.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#7c3aed] text-white flex items-center justify-center font-bold text-sm">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-white">{user.username || 'User'}</p>
          <p className="text-[10px] text-slate-500 truncate w-32">{user.email || ''}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Navigation</p>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div key={tab.id} className="space-y-1">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-[#2a2a35] text-[#a78bfa]"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Icon size={16} opacity={activeTab === tab.id ? 1 : 0.5} />
                    {tab.label}
                  </div>
                  {tab.id === 'requests' && pendingCount > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </div>
              </button>
              
              {tab.id === 'tasks' && activeTab === 'tasks' && (
                <div className="pl-9 pr-0 py-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  {['ALL', 'WORK', 'PERSONAL', 'SHOPPING', 'OTHER'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={clsx(
                        "w-full text-left px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-300",
                        selectedCategory === cat
                          ? "bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                          : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200"
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

      <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
        {/* Compact Stats for Sidebar */}
        <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-4 border border-slate-100 dark:border-white/5 dark:backdrop-blur-md">
           <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Tasks Done</p>
           <div className="flex items-end justify-between mb-1">
              <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.completed}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">/ {stats.total}</span>
           </div>
           <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.completed / Math.max(1, stats.total)) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] shadow-[0_0_10px_rgba(124,58,237,0.5)]"
              />
           </div>
        </div>
      </div>
    </div>
  );
}
