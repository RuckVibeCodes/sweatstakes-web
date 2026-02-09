import { Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import WorkoutsPage from './pages/WorkoutsPage'
import WorkoutDetailPage from './pages/WorkoutDetailPage'
import MealsPage from './pages/MealsPage'
import CheckInPage from './pages/CheckInPage'
import ProgressPage from './pages/ProgressPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/workouts/:week/:day" element={<WorkoutDetailPage />} />
        <Route path="/meals" element={<MealsPage />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </>
  )
}

export default App
