import React from 'react';
import { motion } from 'framer-motion';
import { Footprints, Flame, Droplets, Plus, RotateCcw, Edit2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function HealthDashboard({ metrics, onUpdate, onLogFood }) {
  const stepGoal = 10000;
  const waterGoal = 3000;
  const calorieGoal = 2500;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="text-center lg:text-left mb-10">
        <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Health & Vitality</h2>
        <p className="text-slate-500 dark:text-zinc-500 font-medium">Track your daily vitals and nutrition</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Steps Card */}
        <HealthCard
          title="Daily Steps"
          value={metrics.steps}
          unit="steps"
          goal={stepGoal}
          icon={<Footprints className="text-emerald-500" />}
          color="emerald"
          onAction={() => {
            const val = prompt("Enter steps taken:", metrics.steps);
            if (val !== null) onUpdate({ steps: parseInt(val) || 0 });
          }}
          actionLabel="Edit Manually"
        />

        {/* Calories Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center shadow-inner">
                <Flame size={24} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Nutrition</h3>
            </div>
            <button onClick={() => onUpdate({ calories: 0, protein: 0, carbs: 0, fats: 0 })} className="p-2 text-slate-300 hover:text-orange-500 transition-colors">
              <RotateCcw size={20} />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-black text-orange-500">{metrics.calories}</span>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">kcal</span>
          </div>
          <p className="text-xs font-bold text-slate-400 mb-8 tracking-wide uppercase">Goal: {calorieGoal} kcal</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
             <MacroItem label="Prot" value={metrics.protein} color="emerald" />
             <MacroItem label="Carb" value={metrics.carbs} color="blue" />
             <MacroItem label="Fat" value={metrics.fats} color="pink" />
          </div>

          <button
            onClick={onLogFood}
            className="w-full h-14 bg-orange-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            <Plus size={20} />
            Log Food & Calories
          </button>
        </div>

        {/* Water Card */}
        <HealthCard
          title="Water Intake"
          value={metrics.water}
          unit="ml"
          goal={waterGoal}
          icon={<Droplets className="text-blue-500" />}
          color="blue"
          onAction={() => {
            const val = prompt("Enter water intake (ml):", metrics.water);
            if (val !== null) onUpdate({ water: parseInt(val) || 0 });
          }}
          actionLabel="Adjust Intake"
        />
      </div>
    </div>
  );
}

function HealthCard({ title, value, unit, goal, icon, color, onAction, actionLabel }) {
  const progress = Math.min(100, (value / goal) * 100);
  const colorMap = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-4 mb-8">
        <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", `bg-${color}-50 dark:bg-${color}-500/10`)}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">{title}</h3>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className={clsx("text-5xl font-black", `text-${color}-500`)}>{value}</span>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{unit}</span>
      </div>
      <p className="text-xs font-bold text-slate-400 mb-8 tracking-wide uppercase">Goal: {goal} {unit}</p>

      <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={clsx("h-full", colorMap[color])}
        />
      </div>

      <button
        onClick={onAction}
        className={clsx("w-full h-14 border rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
          `border-${color}-100 dark:border-${color}-500/20 text-${color}-500 hover:bg-${color}-50 dark:hover:bg-${color}-500/10`)}
      >
        <Edit2 size={16} />
        {actionLabel}
      </button>
    </div>
  );
}

function MacroItem({ label, value, color }) {
  const colorMap = {
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    pink: "text-pink-500"
  };
  return (
    <div className="text-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">{label}</p>
      <p className={clsx("text-lg font-black", colorMap[color])}>{Math.round(value)}g</p>
    </div>
  );
}
