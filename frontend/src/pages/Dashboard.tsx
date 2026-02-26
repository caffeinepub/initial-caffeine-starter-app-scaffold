import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import ProfileSetupModal from '../components/ProfileSetupModal';

export default function Dashboard() {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} />
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight font-devanagari">Dashboard</h1>
            <p className="text-muted-foreground text-lg font-body">
              Welcome back{userProfile ? `, ${userProfile.name}` : ''}! 🙏
            </p>
          </div>
          <Alert className="border-2 border-saffron/20 bg-saffron/5">
            <User className="h-4 w-4 text-saffron" />
            <AlertDescription className="text-foreground font-body">
              You are successfully authenticated with Internet Identity
            </AlertDescription>
          </Alert>
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="font-devanagari">🙏 Jai Shri Ram</CardTitle>
              <CardDescription className="font-body">Your spiritual journey continues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-body">
                Use the bottom navigation to explore Panchang, Jap Counter, Mandir Finder, and more.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
