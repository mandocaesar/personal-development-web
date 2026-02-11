'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to access this resource.',
  Verification: 'The verification link may have expired or already been used.',
  CredentialsSignin: 'Invalid email or password. Please try again.',
  SessionRequired: 'You must be signed in to access this page.',
  Default: 'An unexpected authentication error occurred.',
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="card-title text-2xl font-bold">Authentication Error</h2>
          <p className="text-base-content/70 mt-2">{message}</p>

          {error === 'AccessDenied' && (
            <div className="alert alert-warning mt-4">
              <span>If you believe this is a mistake, contact your administrator.</span>
            </div>
          )}

          <div className="card-actions mt-6 w-full flex flex-col gap-2">
            <Link href="/auth/signin" className="btn btn-primary w-full">
              Back to Sign In
            </Link>
            <Link href="/" className="btn btn-ghost btn-sm w-full">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
