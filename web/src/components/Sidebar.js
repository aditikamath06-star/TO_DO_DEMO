import React from 'react';
import { motion } from 'framer-motion';
import { Check, ClipboardList, Inbox, Settings as SettingsIcon, Sun, Moon, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar({
  activeTab,
  setActiveTab,
  stats,
  selectedCategory,
  setSelectedCategory,
  pendingCount = 0,
  user,
  isDarkMode,
  setIsDarkMode,
  onLogout
}) {
  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'requests', label: 'Requests', icon: Inbox },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="peer hidden lg:flex flex-col w-20 hover:w-64 h-[calc(100vh-2rem)] fixed left-4 top-4 bg-white dark:bg-[#13131a] border border-slate-100 dark:border-white/5 p-4 z-30 shadow-2xl rounded-3xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group overflow-hidden">
      
      {/* Clickable Profile Section */}
      <button 
        onClick={() => setActiveTab('settings')}
        className="flex items-center justify-center group-hover:justify-start mb-8 h-12 w-full group-hover:px-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all duration-300"
      >
        <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-white/10 transition-all duration-300">
          {user?.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] text-white flex items-center justify-center font-bold text-sm">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ml-0 group-hover:ml-3 text-left">
          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.username || 'User'}</p>
          <p className="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
        </div>
      </button>

      <nav className="flex-1 space-y-2">
        <div className="h-0 group-hover:h-4 group-hover:mb-4 mb-0 flex items-center justify-start group-hover:px-4 transition-all duration-300 overflow-hidden">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">Navigation</p>
        </div>
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div key={tab.id} className="space-y-1">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "w-full flex items-center justify-center group-hover:justify-start h-12 rounded-xl font-bold text-sm transition-all duration-300 group-hover:px-4",
                  activeTab === tab.id
                    ? "bg-[#2a2a35] text-[#a78bfa]"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent"
                )}
              >
                <div className="relative shrink-0 flex items-center justify-center transition-all duration-300">
                  <Icon size={22} opacity={activeTab === tab.id ? 1 : 0.5} />
                  {tab.id === 'requests' && pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#181820] rounded-full animate-pulse group-hover:hidden" />
                  )}
                </div>
                <span className="opacity-0 group-hover:opacity-100 w-0 group-hover:flex-1 overflow-hidden transition-all duration-300 whitespace-nowrap ml-0 group-hover:ml-4 text-left">
                  {tab.label}
                </span>
                {tab.id === 'requests' && pendingCount > 0 && (
                  <span className="w-5 h-5 mr-0 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {pendingCount}
                  </span>
                )}
              </button>

              {tab.id === 'tasks' && activeTab === 'tasks' && (
                <div className="pl-0 group-hover:pl-11 pr-0 py-2 space-y-1 animate-in slide-in-from-top-2 duration-300 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transition-all">
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
        <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-4 border border-slate-100 dark:border-white/5 dark:backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden flex flex-col justify-center mb-0 group-hover:mb-4">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Tasks Done</p>
          <div className="flex items-end justify-between mb-1">
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats?.completed || 0}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">/ {stats?.total || 0}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((stats?.completed || 0) / Math.max(1, stats?.total || 1)) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] shadow-[0_0_10px_rgba(124,58,237,0.5)]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-col group-hover:flex-row transition-all duration-300">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full group-hover:flex-1 flex items-center justify-center group-hover:justify-start h-12 group-hover:h-10 group-hover:px-4 bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#7c3aed] dark:hover:text-[#a78bfa] transition-all duration-300"
          >
            <div className="relative shrink-0 flex items-center justify-center">
              {isDarkMode ? <Sun size={18} strokeWidth={3} className="shrink-0" /> : <Moon size={18} strokeWidth={3} className="shrink-0" />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap hidden group-hover:block transition-opacity duration-300 ml-0 group-hover:ml-3">
              {isDarkMode ? 'Light' : 'Dark'}
            </span>
          </button>
          <button
            onClick={onLogout}
            className="w-full group-hover:flex-1 flex items-center justify-center group-hover:justify-start h-12 group-hover:h-10 group-hover:px-4 bg-red-50 dark:bg-red-500/10 backdrop-blur-md border border-red-100 dark:border-red-500/20 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-300"
          >
            <div className="relative shrink-0 flex items-center justify-center">
              <LogOut size={18} strokeWidth={3} className="shrink-0" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap hidden group-hover:block transition-opacity duration-300 ml-0 group-hover:ml-3">
              Logout
            </span>
          </button>
        </div>

        {/* App Logo moved to bottom */}
        <div className="flex items-center justify-center group-hover:justify-start mt-4 pt-4 border-t border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-300 h-12 group-hover:px-2">
          <div className="relative shrink-0 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl shadow-lg shadow-indigo-500/20">
            <div className="w-4 h-4 bg-green-400 rounded flex items-center justify-center shadow-sm">
              <Check size={10} className="text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-[14px] font-bold text-slate-800 dark:text-white tracking-tight transition-opacity duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto ml-0 group-hover:ml-3">
            TodoList
          </h1>
        </div>
      </div>
    </div>
  );
}
