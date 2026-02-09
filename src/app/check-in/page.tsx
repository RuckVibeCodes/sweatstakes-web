'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase';

export default function CheckInPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [weight, setWeight] = useState('');
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [mealsLogged, setMealsLogged] = useState(false);
  const [mood, setMood] = useState(3);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodEmojis = ['😫', '😕', '😐', '😊', '🔥'];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    try {
      let photoUrl = null;

      // Upload photo if provided
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${user.id}/${today}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('progress-photos')
          .upload(fileName, photo);

        if (uploadError) {
          console.error('Photo upload error:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('progress-photos')
            .getPublicUrl(fileName);
          photoUrl = publicUrl;
        }
      }

      // Insert check-in
      const { error } = await supabase.from('daily_check_ins').insert({
        user_id: user.id,
        date: today,
        weight: weight ? parseFloat(weight) : null,
        workout_completed: workoutCompleted,
        meals_logged: mealsLogged,
        mood: mood as 1 | 2 | 3 | 4 | 5,
        notes: notes || null,
        photo_url: photoUrl,
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to submit check-in:', error);
      alert('Failed to submit check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold mb-4">Sign in to check in</h1>
          <Link href="/auth" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Daily Check-In</h1>
        <p className="text-neutral-400">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Weight */}
        <div className="card">
          <label className="label">Current Weight (lbs)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input"
            placeholder="185"
            step="0.1"
          />
          <p className="text-sm text-neutral-500 mt-2">Optional - weigh in for progress tracking</p>
        </div>

        {/* Daily Tasks */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Today&apos;s Tasks</h2>
          
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setWorkoutCompleted(!workoutCompleted)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
                workoutCompleted
                  ? 'bg-green-500/20 border-green-500/50'
                  : 'bg-neutral-800/50 border-neutral-700'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                workoutCompleted ? 'border-green-500 bg-green-500' : 'border-neutral-500'
              }`}>
                {workoutCompleted && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <div className="font-medium">Completed Workout</div>
                <div className="text-sm text-neutral-400">Did you exercise today?</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMealsLogged(!mealsLogged)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
                mealsLogged
                  ? 'bg-green-500/20 border-green-500/50'
                  : 'bg-neutral-800/50 border-neutral-700'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                mealsLogged ? 'border-green-500 bg-green-500' : 'border-neutral-500'
              }`}>
                {mealsLogged && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <div className="font-medium">Logged Meals</div>
                <div className="text-sm text-neutral-400">Did you track your nutrition?</div>
              </div>
            </button>
          </div>
        </div>

        {/* Mood */}
        <div className="card">
          <label className="label">How are you feeling?</label>
          <div className="flex gap-2">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setMood(index + 1)}
                className={`flex-1 py-4 text-2xl rounded-lg border transition-all ${
                  mood === index + 1
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Photo */}
        <div className="card">
          <label className="label">Progress Photo (Optional)</label>
          <div className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              {photo ? (
                <div>
                  <div className="text-green-500 mb-2">📸</div>
                  <div className="text-green-500">{photo.name}</div>
                  <div className="text-sm text-neutral-400 mt-1">Click to change</div>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-neutral-400">Click to upload a photo</div>
                  <div className="text-sm text-neutral-500 mt-1">Earn +5 points!</div>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <label className="label">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input min-h-[100px] resize-none"
            placeholder="How did today go? Any wins or challenges?"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Check-In ✓'}
        </button>
      </form>
    </div>
  );
}
