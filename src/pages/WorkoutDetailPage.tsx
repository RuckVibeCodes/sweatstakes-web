import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { createClient } from '../lib/supabase';
import workoutsData from '../data/workouts.json';

export default function WorkoutDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const week = parseInt(params.week as string);
  const day = parseInt(params.day as string);
  
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [effort, setEffort] = useState(3);
  const [duration, setDuration] = useState(45);
  const [isLogging, setIsLogging] = useState(false);
  
  const weekData = workoutsData.weeks[week - 1];
  const dayData = weekData?.days[day - 1];

  if (!weekData || !dayData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Workout Not Found</h1>
          <Link to="/workouts" className="btn-secondary">
            Back to Workouts
          </Link>
        </div>
      </div>
    );
  }

  const toggleExercise = (index: number) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedExercises(newCompleted);
  };

  const handleLogWorkout = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsLogging(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from('workout_logs').insert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        week,
        day,
        exercises_completed: dayData.exercises.map((name, i) => ({
          name,
          sets_completed: completedExercises.has(i) ? 3 : 0,
          reps: completedExercises.has(i) ? [10, 10, 10] : [],
        })),
        duration_minutes: duration,
        perceived_effort: effort,
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to log workout:', error);
      alert('Failed to log workout. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  const allCompleted = completedExercises.size === dayData.exercises.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/workouts" className="text-blue-500 hover:underline text-sm mb-2 inline-block">
          ← Back to Workouts
        </Link>
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{dayData.focus}</h1>
            <p className="text-neutral-400">Week {week} • Day {day} • {weekData.theme}</p>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Exercises</h2>
        <div className="space-y-3">
          {dayData.exercises.map((exercise, index) => (
            <button
              key={index}
              onClick={() => toggleExercise(index)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
                completedExercises.has(index)
                  ? 'bg-blue-500/20 border-blue-500/50'
                  : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                completedExercises.has(index)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-neutral-500'
              }`}>
                {completedExercises.has(index) && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={completedExercises.has(index) ? 'text-blue-400' : 'text-neutral-200'}>
                {exercise}
              </span>
            </button>
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-neutral-400">
          {completedExercises.size} of {dayData.exercises.length} completed
        </div>
      </div>

      {/* Workout Details */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Log Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="label">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              className="input"
              min="1"
              max="180"
            />
          </div>
          
          <div>
            <label className="label">Perceived Effort (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setEffort(level)}
                  className={`flex-1 py-3 rounded-lg border transition-colors ${
                    effort === level
                      ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                      : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>Easy</span>
              <span>Max Effort</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleLogWorkout}
        disabled={isLogging || completedExercises.size === 0}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
          allCompleted
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-neutral-700 hover:bg-neutral-600 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLogging ? 'Logging...' : allCompleted ? '🎉 Complete Workout!' : 'Log Partial Workout'}
      </button>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {day > 1 ? (
          <Link to={`/workouts/${week}/${day - 1}`} className="text-blue-500 hover:underline">
            ← Previous Day
          </Link>
        ) : week > 1 ? (
          <Link to={`/workouts/${week - 1}/5`} className="text-blue-500 hover:underline">
            ← Week {week - 1}
          </Link>
        ) : (
          <div />
        )}
        
        {day < 5 ? (
          <Link to={`/workouts/${week}/${day + 1}`} className="text-blue-500 hover:underline">
            Next Day →
          </Link>
        ) : week < 6 ? (
          <Link to={`/workouts/${week + 1}/1`} className="text-blue-500 hover:underline">
            Week {week + 1} →
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
