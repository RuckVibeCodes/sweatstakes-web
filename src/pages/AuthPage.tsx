import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, user, loading } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup') setMode('signup');
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        // Show success message for signup
        setError('Check your email to confirm your account!');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-blue-500">
            SweatStakes
          </Link>
          <p className="text-neutral-400 mt-2">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <div className="card">
          <div className="flex mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                mode === 'signin'
                  ? 'bg-blue-500/20 text-blue-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-center rounded-lg transition-colors ${
                mode === 'signup'
                  ? 'bg-blue-500/20 text-blue-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                error.includes('Check your email') 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-neutral-500 mt-4 text-sm">
          {mode === 'signup' ? (
            <>Already have an account? <button onClick={() => setMode('signin')} className="text-blue-500 hover:underline">Sign in</button></>
          ) : (
            <>Don't have an account? <button onClick={() => setMode('signup')} className="text-blue-500 hover:underline">Sign up</button></>
          )}
        </p>
      </div>
    </div>
  );
}
