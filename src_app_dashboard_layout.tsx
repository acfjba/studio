// src/app/dashboard/layout.tsx
'use client';
import Link from 'next/link';
import { useAuth } from '@/utils/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>Access Denied: Admins only.</div>;
  }

  // Refresh token to get custom claims
  const [claims, setClaims] = React.useState(null);
  React.useEffect(() => {
    user.getIdTokenResult().then(idTokenResult => {
      setClaims(idTokenResult.claims);
    });
  }, [user]);

  if (!claims?.systemAdmin) {
    return <div>Access Denied: Admins only.</div>;
  }

  return (
    <div>
      <nav className="p-4 bg-tappurple-600 text-white flex justify-between">
        <div>School Platform</div>
        <button onClick={() => logout()}>Logout</button>
      </nav>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
