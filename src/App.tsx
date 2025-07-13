
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './components/DashboardLayout';
import CreateReelPage from './pages/dashboard/CreateReelPage';
import MyReelsPage from './pages/dashboard/MyVictims';
import SubmissionsPage from './pages/dashboard/SubmissionsPage';
import { Toaster } from './components/ui/sonner';
import ConnectMePage from './pages/dashboard/ConnectMePage';
import { ThemeProvider } from './components/theme-provider';
import { Skeleton } from './components/ui/skeleton';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
        <Skeleton className="h-12 w-1/4" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
   return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="create" element={<CreateReelPage />} />
              <Route path="reels" element={<MyReelsPage />} />
              <Route path="submissions" element={<SubmissionsPage />} />
              <Route path="submissions/:reelId" element={<SubmissionsPage />} />
              <Route path="connect-me" element={<ConnectMePage />} />
              <Route index element={<Navigate to="reels" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
        <Toaster />
      </ThemeProvider>
    </Router>
  );
}

export default App;
