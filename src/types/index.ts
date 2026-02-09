// User & Auth
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  height_inches: number;
  starting_weight: number;
  goal: 'cut' | 'maintain' | 'bulk';
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  onboarding_complete: boolean;
}

// Challenge
export interface Challenge {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  entry_fee: number;
  prize_pool: number;
  status: 'upcoming' | 'active' | 'completed';
  participant_count: number;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  starting_weight: number;
  starting_body_fat?: number;
  starting_photo_url?: string;
  final_weight?: number;
  final_body_fat?: number;
  final_photo_url?: string;
  total_score: number;
  rank?: number;
  joined_at: string;
}

// Check-ins & Progress
export interface DailyCheckIn {
  id: string;
  user_id: string;
  challenge_id: string;
  date: string;
  weight?: number;
  workout_completed: boolean;
  workout_id?: string;
  meals_logged: boolean;
  calories_consumed?: number;
  protein_consumed?: number;
  mood: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  photo_url?: string;
  created_at: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  challenge_id: string;
  date: string;
  week: number;
  day: number;
  exercises_completed: ExerciseLog[];
  duration_minutes: number;
  perceived_effort: 1 | 2 | 3 | 4 | 5;
}

export interface ExerciseLog {
  name: string;
  sets_completed: number;
  reps: number[];
  weight?: number;
}

// Meals
export interface MealLog {
  id: string;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_id?: string;
  custom_name?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  avatar_url?: string;
  total_score: number;
  transformation_score: number;
  adherence_score: number;
  engagement_score: number;
  weight_change_percent: number;
}

// Scoring
export interface ScoreSummary {
  total: number;
  transformation: number;
  adherence: number;
  engagement: number;
  workouts_completed: number;
  workouts_total: number;
  meals_logged: number;
  check_ins: number;
  photos_uploaded: number;
}

// Workout Types
export interface WorkoutDay {
  day: number;
  focus: string;
  exercises: string[];
}

export interface WorkoutWeek {
  week: number;
  theme: string;
  days: WorkoutDay[];
}

export interface WorkoutProgram {
  program: {
    name: string;
    duration_weeks: number;
    days_per_week: number;
    style: string;
  };
  weeks: WorkoutWeek[];
}
