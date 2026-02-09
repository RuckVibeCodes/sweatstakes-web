'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';
import workoutsData from '@/data/workouts.json';
import mealsData from '@/data/mealplans.json';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [currentWeek] = useState(1);
  const [currentDay] = useState(1);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user checked in today
    const { data: checkIn } = await supabase
      .from('daily_check_ins')
      .select('id')
      .eq('user_id', user?.id)
      .eq('date', today)
      .single();
    
    setTodayCheckedIn(!!checkIn);

    // Get streak (simplified - count consecutive check-ins)
    const { count } = await supabase
      .from('daily_check_ins')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id);
    
    setStreakDays(count || 0);
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  const todayWorkout = workoutsData.weeks[currentWeek - 1]?.days[currentDay - 1];
  const suggestedMeals = mealsData.meals.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to continue</h1>
          <Link href="/auth" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-neutral-400">Week {currentWeek}, Day {currentDay} of your transformation journey</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-sm text-neutral-400 mb-1">Streak</div>
          <div className="text-2xl font-bold text-green-500">🔥 {streakDays}</div>
        </div>
        <div className="card">
          <div className="text-sm text-neutral-400 mb-1">Week</div>
          <div className="text-2xl font-bold">{currentWeek}/6</div>
        </div>
        <div className="card">
          <div className="text-sm text-neutral-400 mb-1">Workouts</div>
          <div className="text-2xl font-bold">0/{currentWeek * 5}</div>
        </div>
        <div className="card">
          <div className="text-sm text-neutral-400 mb-1">Check-ins</div>
          <div className="text-2xl font-bold">{streakDays}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Workout */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today&apos;s Workout</h2>
            <span className="text-sm text-neutral-400">{workoutsData.weeks[currentWeek - 1]?.theme}</span>
          </div>
          
          {todayWorkout ? (
            <>
              <div className="bg-green-500/10 rounded-lg p-4 mb-4">
                <div className="text-green-500 font-semibold text-lg">{todayWorkout.focus}</div>
                <div className="text-sm text-neutral-400">Day {todayWorkout.day}</div>
              </div>
              
              <ul className="space-y-2 mb-4">
                {todayWorkout.exercises.slice(0, 3).map((exercise, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-300">
                    <span className="text-green-500">•</span>
                    {exercise}
                  </li>
                ))}
                {todayWorkout.exercises.length > 3 && (
                  <li className="text-neutral-500">+{todayWorkout.exercises.length - 3} more...</li>
                )}
              </ul>
              
              <Link href={`/workouts/${currentWeek}/${currentDay}`} className="btn-primary block text-center">
                Start Workout
              </Link>
            </>
          ) : (
            <p className="text-neutral-400">Rest day! Take it easy.</p>
          )}
        </div>

        {/* Quick Check-in */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Daily Check-in</h2>
          
          {todayCheckedIn ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-500 font-semibold">You&apos;re checked in!</p>
              <p className="text-neutral-400 text-sm">Come back tomorrow</p>
            </div>
          ) : (
            <>
              <p className="text-neutral-400 mb-4">
                Log your daily progress to stay on track and boost your score.
              </p>
              <Link href="/check-in" className="btn-primary block text-center">
                Check In Now
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Meal Suggestions */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Meal Ideas</h2>
          <Link href="/meals" className="text-green-500 hover:underline text-sm">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestedMeals.map((meal) => (
            <div key={meal.id} className="card p-4">
              <div className="text-xs text-green-500 uppercase mb-1">{meal.category}</div>
              <div className="font-semibold mb-2">{meal.name}</div>
              <div className="text-sm text-neutral-400">
                {meal.calories} cal • {meal.protein}g protein
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/progress" className="card p-4 text-center hover:border-green-500/50 transition-colors">
          <div className="text-2xl mb-2">📊</div>
          <div className="font-semibold">Progress</div>
        </Link>
        <Link href="/leaderboard" className="card p-4 text-center hover:border-green-500/50 transition-colors">
          <div className="text-2xl mb-2">🏆</div>
          <div className="font-semibold">Leaderboard</div>
        </Link>
        <Link href="/workouts" className="card p-4 text-center hover:border-green-500/50 transition-colors">
          <div className="text-2xl mb-2">📅</div>
          <div className="font-semibold">All Workouts</div>
        </Link>
        <Link href="/meals" className="card p-4 text-center hover:border-green-500/50 transition-colors">
          <div className="text-2xl mb-2">🍽️</div>
          <div className="font-semibold">Meal Plans</div>
        </Link>
      </div>
    </div>
  );
}
