import { Outlet } from '@tanstack/react-router';
import BottomNav from './BottomNav';
import ProfileSetupModal from './ProfileSetupModal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export default function AppLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background max-w-md mx-auto relative">
      <ProfileSetupModal open={showProfileSetup} />

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Footer - minimal, inside scroll area */}
    </div>
  );
}
