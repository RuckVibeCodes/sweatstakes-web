import { Link } from 'react-router-dom';
import scoringConfig from '../data/scoring.json';

export default function LandingPage() {
  const entryFee = scoringConfig.prizes.entry_fee;
  const prizeDistribution = scoringConfig.prizes.distribution;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-neutral-950 to-neutral-950" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Transform.</span>{' '}
              <span className="text-blue-500">Compete.</span>{' '}
              <span className="text-white">Win.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 mb-8 max-w-2xl mx-auto">
              Join the ultimate 6-week fitness challenge. Put your money where your muscles are
              and compete for cash prizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup" className="btn-primary text-lg py-4 px-8">
                Join for ${entryFee}
              </Link>
              <a href="#how-it-works" className="btn-secondary text-lg py-4 px-8">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-500">6</div>
              <div className="text-neutral-400">Weeks</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500">30</div>
              <div className="text-neutral-400">Workouts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500">${entryFee}</div>
              <div className="text-neutral-400">Entry Fee</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500">5</div>
              <div className="text-neutral-400">Prizes</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">1. Sign Up</h3>
              <p className="text-neutral-400">
                Pay the ${entryFee} entry fee, set your goals, and take your before photos.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold mb-2">2. Train Hard</h3>
              <p className="text-neutral-400">
                Follow our proven 6-week program. Log workouts, track meals, and check in daily.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">3. Win Prizes</h3>
              <p className="text-neutral-400">
                Top performers split the prize pool. Transform your body and your wallet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring Breakdown */}
      <section className="py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Scoring System</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card">
              <div className="text-2xl font-bold text-blue-500 mb-2">50%</div>
              <h3 className="text-lg font-semibold mb-2">Transformation</h3>
              <p className="text-neutral-400 text-sm">
                Body composition changes based on your personal goals (cut, maintain, or bulk).
              </p>
            </div>
            <div className="card">
              <div className="text-2xl font-bold text-blue-500 mb-2">35%</div>
              <h3 className="text-lg font-semibold mb-2">Adherence</h3>
              <p className="text-neutral-400 text-sm">
                Completing workouts and tracking meals consistently throughout the challenge.
              </p>
            </div>
            <div className="card">
              <div className="text-2xl font-bold text-blue-500 mb-2">15%</div>
              <h3 className="text-lg font-semibold mb-2">Engagement</h3>
              <p className="text-neutral-400 text-sm">
                Daily check-ins, progress photos, and community participation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Distribution */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Prize Pool</h2>
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-neutral-800">
                  <span className="text-lg">🥇 Grand Prize</span>
                  <span className="text-xl font-bold text-blue-500">{prizeDistribution.grand_prize * 100}%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-800">
                  <span className="text-lg">🥈 Second Place</span>
                  <span className="text-xl font-bold text-blue-500">{prizeDistribution.second_place * 100}%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-800">
                  <span className="text-lg">🥉 Third Place</span>
                  <span className="text-xl font-bold text-blue-500">{prizeDistribution.third_place * 100}%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-800">
                  <span className="text-lg">📈 Most Improved</span>
                  <span className="text-xl font-bold text-blue-500">{prizeDistribution.most_improved * 100}%</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-lg">⭐ Best Consistency</span>
                  <span className="text-xl font-bold text-blue-500">{prizeDistribution.best_consistency * 100}%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-neutral-500 mt-4 text-sm">
              Prize pool = 80% of total entry fees. 20% platform fee.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-t from-blue-900/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform?</h2>
          <p className="text-xl text-neutral-400 mb-8">
            The next challenge starts soon. Secure your spot now.
          </p>
          <Link to="/auth?mode=signup" className="btn-primary text-lg py-4 px-12">
            Join SweatStakes for ${entryFee}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-neutral-500">
          <p>&copy; 2025 SweatStakes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
