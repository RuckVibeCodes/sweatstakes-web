'use client';

import { useState } from 'react';
import mealsData from '@/data/mealplans.json';

type MealCategory = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack';

export default function MealsPage() {
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('all');
  const [selectedGoal, setSelectedGoal] = useState<'cut' | 'maintain' | 'bulk'>('maintain');

  const categories: { value: MealCategory; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '🍽️' },
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snacks', icon: '🍎' },
  ];

  const filteredMeals = mealsData.meals.filter(
    (meal) => selectedCategory === 'all' || meal.category === selectedCategory
  );

  const goalPlan = mealsData.plans[selectedGoal];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meal Plans</h1>
        <p className="text-neutral-400">
          Fuel your transformation with our curated meal options
        </p>
      </div>

      {/* Goal Selector */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-3">Your Goal</h2>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(mealsData.plans).map(([key, plan]) => (
            <button
              key={key}
              onClick={() => setSelectedGoal(key as 'cut' | 'maintain' | 'bulk')}
              className={`p-4 rounded-lg border transition-colors ${
                selectedGoal === key
                  ? 'bg-green-500/20 border-green-500'
                  : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
              }`}
            >
              <div className="font-semibold">{plan.name}</div>
              <div className="text-sm text-neutral-400">
                {plan.protein_per_lb}g protein/lb
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-neutral-800/50 rounded-lg">
          <div className="text-sm text-neutral-400">
            <strong className="text-green-500">{goalPlan.name}</strong> plan: 
            Calories at {goalPlan.calories_multiplier * 100}% of maintenance • 
            {goalPlan.carbs_percent * 100}% carbs • 
            {goalPlan.fat_percent * 100}% fat
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === cat.value
                ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Meals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <div key={meal.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs text-green-500 uppercase">{meal.category}</span>
                <h3 className="text-xl font-semibold">{meal.name}</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-500">{meal.calories}</div>
                <div className="text-xs text-neutral-400">calories</div>
              </div>
            </div>
            
            {/* Macros */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                <div className="text-lg font-semibold">{meal.protein}g</div>
                <div className="text-xs text-neutral-400">Protein</div>
              </div>
              <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                <div className="text-lg font-semibold">{meal.carbs}g</div>
                <div className="text-xs text-neutral-400">Carbs</div>
              </div>
              <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                <div className="text-lg font-semibold">{meal.fat}g</div>
                <div className="text-xs text-neutral-400">Fat</div>
              </div>
            </div>
            
            {/* Ingredients */}
            <div>
              <div className="text-sm font-medium text-neutral-400 mb-2">Ingredients</div>
              <ul className="text-sm text-neutral-300 space-y-1">
                {meal.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-500">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
