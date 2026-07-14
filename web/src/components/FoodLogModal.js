import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronRight } from 'lucide-react';
import { commonFoods } from '../data/FoodDatabase';

export default function FoodLogModal({ onClose, onLog }) {
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams] = useState('100');

  const filtered = commonFoods.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));

  const handleLog = () => {
    const g = parseInt(grams) || 0;
    const factor = g / 100;
    onLog({
      calories: Math.round(selectedFood.kcal * factor),
      protein: selectedFood.protein * factor,
      carbs: selectedFood.carbs * factor,
      fats: selectedFood.fats * factor
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-t-[3rem] sm:rounded-[3rem] p-10 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Log Meal</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-full transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {!selectedFood ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
              <input
                autoFocus
                placeholder="Search food (e.g. Rice, Oats...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-16 pl-12 pr-6 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white text-lg"
              />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {filtered.map(food => (
                <button
                  key={food.name}
                  onClick={() => setSelectedFood(food)}
                  className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all border border-transparent hover:border-orange-100 group"
                >
                  <div className="text-left">
                    <p className="font-bold text-slate-800 dark:text-zinc-100">{food.name}</p>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{food.kcal} kcal / 100g</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
             <div className="bg-orange-50 dark:bg-orange-500/10 p-8 rounded-[2rem] border border-orange-100 dark:border-orange-500/20">
                <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">Selected Item</p>
                <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-6">{selectedFood.name}</h3>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Quantity in Grams</label>
                  <input
                    type="number"
                    value={grams}
                    onChange={(e) => setGrams(e.target.value)}
                    className="w-full h-16 px-6 bg-white dark:bg-zinc-900 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white text-2xl font-black"
                  />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setSelectedFood(null)} className="h-16 rounded-2xl font-bold text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">Back to search</button>
                <button
                  onClick={handleLog}
                  className="h-16 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/25 hover:bg-orange-600 transition-all"
                >
                  Log this item
                </button>
             </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
