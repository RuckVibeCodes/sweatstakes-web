'use client';

import Link from 'next/link';
import workoutsData from '@/data/workouts.json';

export default function WorkoutsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Workout Program</h1>
        <p className="text-neutral-400">
          {workoutsData.program.name} • {workoutsData.program.duration_weeks} weeks • {workoutsData.program.days_per_week} days/week
        </p>
      </div>

      <div className="space-y-8">
        {workoutsData.weeks.map((week) => (
          <div key={week.week} className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Week {week.week}</h2>
                <p className="text-green-500">{week.theme}</p>
              </div>
              <span className="text-neutral-400">{week.days.length} workouts</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {week.days.map((day) => (
                <Link
                  key={day.day}
                  href={`/workouts/${week.week}/${day.day}`}
                  className="bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 rounded-lg p-4 transition-colors"
                >
                  <div className="text-sm text-neutral-400 mb-1">Day {day.day}</div>
                  <div className="font-semibold text-green-500 mb-2">{day.focus}</div>
                  <div className="text-xs text-neutral-500">
                    {day.exercises.length} exercises
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
