'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function UnauthorizedPage() {
    const { data: session } = useSession();

    return (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-6">
                <span className="text-5xl">🚫</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Access Denied</h1>
            <p className="text-lg text-base-content/70 mb-2 max-w-md">
                You don&apos;t have permission to access this page.
            </p>
            {session?.user?.role && (
                <p className="text-sm text-base-content/50 mb-6">
                    Your current role: <span className="badge badge-outline">{session.user.role}</span>
                </p>
            )}

            <div className="flex gap-3 mt-4">
                <Link href="/" className="btn btn-primary">
                    Go to Dashboard
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="btn btn-ghost"
                >
                    Go Back
                </button>
            </div>

            <div className="alert alert-info mt-8 max-w-md">
                <span className="text-sm">
                    Need access? Contact your administrator to request the appropriate permissions.
                </span>
            </div>
        </div>
    );
}
