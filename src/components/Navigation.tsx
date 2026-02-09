import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/workouts', label: 'Workouts', icon: '💪' },
  { href: '/meals', label: 'Meals', icon: '🍽️' },
  { href: '/check-in', label: 'Check In', icon: '✅' },
  { href: '/leaderboard', label: 'Rankings', icon: '🏆' },
];

export function Navigation() {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  // Don't show nav on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-blue-500">
              SweatStakes
            </Link>
            
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'text-blue-500 bg-blue-500/10'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {!loading && user ? (
                <>
                  <Link to="/progress" className="text-neutral-400 hover:text-white">
                    Progress
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-neutral-400 hover:text-white"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" className="btn-primary text-sm py-2">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-sm border-t border-neutral-800 safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.href
                  ? 'text-blue-500'
                  : 'text-neutral-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="hidden md:block h-16" />
    </>
  );
}
