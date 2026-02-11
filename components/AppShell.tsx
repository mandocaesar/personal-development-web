'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navigation from '@/components/Navigation';

// Routes that should NOT show the app shell (navigation sidebar)
const AUTH_ROUTES = ['/auth'];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { status } = useSession();

    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
    const isAuthenticated = status === 'authenticated';

    // Auth pages: no navigation, full-width
    if (isAuthRoute || (!isAuthenticated && status !== 'loading')) {
        return <>{children}</>;
    }

    // Loading state
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // Authenticated pages: show navigation
    return (
        <div className="flex">
            <Navigation />
            <main className="flex-1 ml-64 min-h-screen">
                <div className="container-app py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
