import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { createClient } from '../lib/supabase';
import type { DailyCheckIn } from '../types';

export default function ProgressPage() {
  const { user, loading } = useAuth();
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [stats, setStats] = useState({
    startWeight: 0,
    currentWeight: 0,
    weightChange: 0,
    totalCheckIns: 0,
    photosUploaded: 0,
    workoutsCompleted: 0,
  });

  const fetchProgress = useCallback(async () => {
    const supabase = createClient();
    
    // Get all check-ins
    const { data: checkInData } = await supabase
      .from('daily_check_ins')
      .select('*')
      .eq('user_id', user?.id)
      .order('date', { ascending: true });

    if (checkInData) {
      setCheckIns(checkInData);
      
      const weights = checkInData.filter(c => c.weight).map(c => c.weight as number);
      const startWeight = weights[0] || 0;
      const currentWeight = weights[weights.length - 1] || 0;
      
      setStats({
        startWeight,
        currentWeight,
        weightChange: currentWeight - startWeight,
        totalCheckIns: checkInData.length,
        photosUploaded: checkInData.filter(c => c.photo_url).length,
        workoutsCompleted: checkInData.filter(c => c.workout_completed).length,
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user, fetchProgress]);

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
          <h1 className="text-2xl font-bold mb-4">Sign in to view progress</h1>
          <Link to="/auth" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const photosWithUrls = checkIns.filter(c => c.photo_url);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-neutral-400">Track your transformation journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-sm text-neutral-400 mb-1">Starting Weight</div>
          <div className="text-2xl font-bold">{stats.startWeight || '—'} lbs</div>
        </div>
        <div className="card">
          <div className="text-sm text-neutral-400 mb-1">Current Weight</div>
          <div className="text-2xl font-bold">{stats.currentWeight || '—'} lbs</div>
        </div>
        <div className="card">
          <div className="text-sm text-neutral-400 mb-1">Weight Change</div>
          <div className={`text-2xl font-bold ${stats.weightChange < 0 ? 'text-blue-500' : stats.weightChange > 0 ? 'text-red-500' : ''}`}>
            {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)} lbs
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-neutral-400 mb-1">Check-ins</div>
          <div className="text-2xl font-bold text-blue-500">{stats.totalCheckIns}</div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-4xl mb-2">💪</div>
          <div className="text-3xl font-bold">{stats.workoutsCompleted}</div>
          <div className="text-neutral-400">Workouts Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-2">📸</div>
          <div className="text-3xl font-bold">{stats.photosUploaded}</div>
          <div className="text-neutral-400">Progress Photos</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-3xl font-bold">{stats.totalCheckIns}</div>
          <div className="text-neutral-400">Day Streak</div>
        </div>
      </div>

      {/* Weight Chart (Simplified) */}
      {checkIns.filter(c => c.weight).length > 0 && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Weight Trend</h2>
          <div className="h-64 flex items-end gap-1">
            {checkIns.filter(c => c.weight).map((checkIn) => {
              const weights = checkIns.filter(c => c.weight).map(c => c.weight as number);
              const min = Math.min(...weights);
              const max = Math.max(...weights);
              const range = max - min || 1;
              const height = ((checkIn.weight! - min) / range) * 100;
              
              return (
                <div
                  key={checkIn.id}
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 rounded-t transition-colors"
                  style={{ height: `${Math.max(height, 10)}%` }}
                  title={`${checkIn.date}: ${checkIn.weight} lbs`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-neutral-500 mt-2">
            <span>{checkIns.filter(c => c.weight)[0]?.date}</span>
            <span>{checkIns.filter(c => c.weight).slice(-1)[0]?.date}</span>
          </div>
        </div>
      )}

      {/* Progress Photos */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Progress Photos</h2>
        
        {photosWithUrls.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photosWithUrls.map((checkIn) => (
              <div key={checkIn.id} className="relative">
                <img
                  src={checkIn.photo_url!}
                  alt={`Progress photo from ${checkIn.date}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs">
                  {new Date(checkIn.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📷</div>
            <p className="text-neutral-400 mb-4">No progress photos yet</p>
            <Link to="/check-in" className="btn-primary">
              Upload Your First Photo
            </Link>
          </div>
        )}
      </div>

      {/* Recent Check-ins */}
      {checkIns.length > 0 && (
        <div className="card mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Check-ins</h2>
          <div className="space-y-3">
            {checkIns.slice(-7).reverse().map((checkIn) => (
              <div key={checkIn.id} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                <div>
                  <div className="font-medium">
                    {new Date(checkIn.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm text-neutral-400">
                    {checkIn.weight && `${checkIn.weight} lbs • `}
                    Mood: {['😫', '😕', '😐', '😊', '🔥'][checkIn.mood - 1]}
                  </div>
                </div>
                <div className="flex gap-2">
                  {checkIn.workout_completed && <span className="text-blue-500">💪</span>}
                  {checkIn.meals_logged && <span className="text-blue-500">🍽️</span>}
                  {checkIn.photo_url && <span className="text-blue-500">📸</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
