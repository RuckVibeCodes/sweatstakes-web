import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { createClient } from '../lib/supabase';
import type { LeaderboardEntry } from '../types';

// Mock data for demo purposes - in production this comes from the database
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user_id: '1', user_name: 'Sarah M.', total_score: 94.5, transformation_score: 95, adherence_score: 98, engagement_score: 85, weight_change_percent: -8.2 },
  { rank: 2, user_id: '2', user_name: 'Mike T.', total_score: 91.2, transformation_score: 88, adherence_score: 95, engagement_score: 90, weight_change_percent: -6.5 },
  { rank: 3, user_id: '3', user_name: 'Jessica R.', total_score: 89.8, transformation_score: 92, adherence_score: 88, engagement_score: 88, weight_change_percent: -7.1 },
  { rank: 4, user_id: '4', user_name: 'David L.', total_score: 87.3, transformation_score: 85, adherence_score: 90, engagement_score: 85, weight_change_percent: 3.2 },
  { rank: 5, user_id: '5', user_name: 'Emily K.', total_score: 85.9, transformation_score: 82, adherence_score: 92, engagement_score: 80, weight_change_percent: -5.8 },
  { rank: 6, user_id: '6', user_name: 'Chris B.', total_score: 84.1, transformation_score: 80, adherence_score: 88, engagement_score: 82, weight_change_percent: -4.5 },
  { rank: 7, user_id: '7', user_name: 'Amanda W.', total_score: 82.5, transformation_score: 78, adherence_score: 86, engagement_score: 84, weight_change_percent: -5.2 },
  { rank: 8, user_id: '8', user_name: 'Jason P.', total_score: 80.2, transformation_score: 75, adherence_score: 85, engagement_score: 80, weight_change_percent: 2.1 },
];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [activeTab, setActiveTab] = useState<'overall' | 'transformation' | 'adherence' | 'engagement'>('overall');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const supabase = createClient();
    
    // In production, fetch from challenge_participants joined with users
    // For now, use mock data
    const { data } = await supabase
      .from('challenge_participants')
      .select('*, users(full_name, avatar_url)')
      .order('total_score', { ascending: false })
      .limit(50);

    if (data && data.length > 0) {
      // Transform data to LeaderboardEntry format
      // setLeaderboard(transformedData);
    }
  };

  const getSortedLeaderboard = () => {
    const sorted = [...leaderboard];
    switch (activeTab) {
      case 'transformation':
        return sorted.sort((a, b) => b.transformation_score - a.transformation_score);
      case 'adherence':
        return sorted.sort((a, b) => b.adherence_score - a.adherence_score);
      case 'engagement':
        return sorted.sort((a, b) => b.engagement_score - a.engagement_score);
      default:
        return sorted.sort((a, b) => b.total_score - a.total_score);
    }
  };

  const getScoreForTab = (entry: LeaderboardEntry) => {
    switch (activeTab) {
      case 'transformation':
        return entry.transformation_score;
      case 'adherence':
        return entry.adherence_score;
      case 'engagement':
        return entry.engagement_score;
      default:
        return entry.total_score;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const sortedLeaderboard = getSortedLeaderboard();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-neutral-400">See how you stack up against the competition</p>
      </div>

      {/* Prize Pool Banner */}
      <div className="card bg-gradient-to-r from-blue-900/30 to-blue-800/20 border-blue-700/50 mb-8">
        <div className="text-center">
          <div className="text-sm text-blue-400 mb-1">Current Prize Pool</div>
          <div className="text-4xl font-bold text-blue-500">$1,248</div>
          <div className="text-sm text-neutral-400 mt-2">32 participants • Challenge ends in 21 days</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'overall', label: 'Overall', icon: '🏆' },
          { key: 'transformation', label: 'Transform', icon: '💪' },
          { key: 'adherence', label: 'Adherence', icon: '📊' },
          { key: 'engagement', label: 'Engage', icon: '⭐' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-500/20 text-blue-500 border border-blue-500/50'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Second Place */}
        <div className="card text-center mt-8">
          <div className="text-3xl mb-2">🥈</div>
          <div className="font-semibold">{sortedLeaderboard[1]?.user_name}</div>
          <div className="text-2xl font-bold text-blue-500">{getScoreForTab(sortedLeaderboard[1])}</div>
          <div className="text-sm text-neutral-400">{sortedLeaderboard[1]?.weight_change_percent}%</div>
        </div>
        
        {/* First Place */}
        <div className="card text-center bg-gradient-to-b from-yellow-900/20 to-transparent border-yellow-600/30">
          <div className="text-4xl mb-2">🥇</div>
          <div className="font-semibold text-lg">{sortedLeaderboard[0]?.user_name}</div>
          <div className="text-3xl font-bold text-blue-500">{getScoreForTab(sortedLeaderboard[0])}</div>
          <div className="text-sm text-neutral-400">{sortedLeaderboard[0]?.weight_change_percent}%</div>
        </div>
        
        {/* Third Place */}
        <div className="card text-center mt-8">
          <div className="text-3xl mb-2">🥉</div>
          <div className="font-semibold">{sortedLeaderboard[2]?.user_name}</div>
          <div className="text-2xl font-bold text-blue-500">{getScoreForTab(sortedLeaderboard[2])}</div>
          <div className="text-sm text-neutral-400">{sortedLeaderboard[2]?.weight_change_percent}%</div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Full Rankings</h2>
        <div className="space-y-2">
          {sortedLeaderboard.map((entry, index) => {
            const isCurrentUser = user && entry.user_id === user.id;
            
            return (
              <div
                key={entry.user_id}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isCurrentUser
                    ? 'bg-blue-500/20 border border-blue-500/50'
                    : 'bg-neutral-800/50 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 text-center ${index < 3 ? 'text-xl' : 'text-neutral-400'}`}>
                    {getRankBadge(index + 1)}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {entry.user_name}
                      {isCurrentUser && <span className="text-blue-500 ml-2">(You)</span>}
                    </div>
                    <div className="text-sm text-neutral-400">
                      Weight: {entry.weight_change_percent > 0 ? '+' : ''}{entry.weight_change_percent}%
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-500">{getScoreForTab(entry)}</div>
                  <div className="text-xs text-neutral-400">points</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Your Position (if not in top 8) */}
      {user && !sortedLeaderboard.find(e => e.user_id === user.id) && (
        <div className="card mt-6 bg-neutral-800/50">
          <div className="text-center py-4">
            <p className="text-neutral-400 mb-2">You haven't joined the challenge yet</p>
            <Link to="/auth?mode=signup" className="btn-primary">
              Join Now
            </Link>
          </div>
        </div>
      )}

      {/* Scoring Info */}
      <div className="mt-8 text-center text-sm text-neutral-500">
        <p>Scores update every hour based on check-ins, workouts, and progress photos.</p>
        <p className="mt-1">
          Scoring: 50% Transformation • 35% Adherence • 15% Engagement
        </p>
      </div>
    </div>
  );
}
