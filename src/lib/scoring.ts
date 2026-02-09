import scoringConfig from '../data/scoring.json';
import { DailyCheckIn, WorkoutLog, ScoreSummary } from '../types';

export function calculateTransformationScore(
  startWeight: number,
  currentWeight: number,
  goal: 'cut' | 'maintain' | 'bulk',
  weeksElapsed: number
): number {
  const weightChange = startWeight - currentWeight;
  const changePercent = (weightChange / startWeight) * 100;
  
  let score = 0;
  
  if (goal === 'cut') {
    // Reward healthy weight loss (1-2% per week)
    const idealLoss = weeksElapsed * 1.5; // 1.5% per week target
    const accuracy = 100 - Math.abs(changePercent - idealLoss) * 10;
    score = Math.max(0, Math.min(100, accuracy));
  } else if (goal === 'bulk') {
    // Reward lean gains (0.5-1% per week)
    const idealGain = weeksElapsed * 0.75;
    const accuracy = 100 - Math.abs(-changePercent - idealGain) * 10;
    score = Math.max(0, Math.min(100, accuracy));
  } else {
    // Maintenance: reward staying within 2%
    score = changePercent <= 2 ? 100 : Math.max(0, 100 - (changePercent - 2) * 20);
  }
  
  return score;
}

export function calculateAdherenceScore(
  workoutLogs: WorkoutLog[],
  checkIns: DailyCheckIn[],
  totalWorkoutDays: number
): number {
  const workoutWeight = scoringConfig.adherence.workout_completion.weight;
  const mealWeight = scoringConfig.adherence.meal_tracking.weight;
  
  // Workout completion score
  const workoutsCompleted = workoutLogs.length;
  const workoutScore = (workoutsCompleted / totalWorkoutDays) * 100;
  
  // Meal tracking score
  const mealsLogged = checkIns.filter(c => c.meals_logged).length;
  const mealScore = (mealsLogged / checkIns.length) * 100 || 0;
  
  return (workoutScore * workoutWeight) + (mealScore * mealWeight);
}

export function calculateEngagementScore(
  checkIns: DailyCheckIn[],
  photosUploaded: number,
  communityPosts: number
): number {
  const dailyCheckInPoints = checkIns.length * scoringConfig.engagement.daily_check_in.points;
  const photoPoints = photosUploaded * scoringConfig.engagement.progress_photo.points;
  const postPoints = communityPosts * scoringConfig.engagement.community_post.points;
  
  // Normalize to 100
  const maxPossible = (42 * 2) + (12 * 5) + (42 * 3); // 6 weeks worth
  const earned = dailyCheckInPoints + photoPoints + postPoints;
  
  return Math.min(100, (earned / maxPossible) * 100);
}

export function calculateTotalScore(
  transformation: number,
  adherence: number,
  engagement: number
): number {
  const weights = scoringConfig.weights;
  return (
    transformation * weights.transformation +
    adherence * weights.adherence +
    engagement * weights.engagement
  );
}

export function getScoreSummary(
  startWeight: number,
  currentWeight: number,
  goal: 'cut' | 'maintain' | 'bulk',
  weeksElapsed: number,
  workoutLogs: WorkoutLog[],
  checkIns: DailyCheckIn[],
  photosUploaded: number,
  communityPosts: number
): ScoreSummary {
  const totalWorkoutDays = weeksElapsed * 5;
  
  const transformation = calculateTransformationScore(startWeight, currentWeight, goal, weeksElapsed);
  const adherence = calculateAdherenceScore(workoutLogs, checkIns, totalWorkoutDays);
  const engagement = calculateEngagementScore(checkIns, photosUploaded, communityPosts);
  const total = calculateTotalScore(transformation, adherence, engagement);
  
  return {
    total: Math.round(total * 10) / 10,
    transformation: Math.round(transformation * 10) / 10,
    adherence: Math.round(adherence * 10) / 10,
    engagement: Math.round(engagement * 10) / 10,
    workouts_completed: workoutLogs.length,
    workouts_total: totalWorkoutDays,
    meals_logged: checkIns.filter(c => c.meals_logged).length,
    check_ins: checkIns.length,
    photos_uploaded: photosUploaded,
  };
}

export function calculatePrizeDistribution(prizePool: number): {
  grand: number;
  second: number;
  third: number;
  mostImproved: number;
  bestConsistency: number;
} {
  const dist = scoringConfig.prizes.distribution;
  return {
    grand: prizePool * dist.grand_prize,
    second: prizePool * dist.second_place,
    third: prizePool * dist.third_place,
    mostImproved: prizePool * dist.most_improved,
    bestConsistency: prizePool * dist.best_consistency,
  };
}
