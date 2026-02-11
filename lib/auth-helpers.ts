'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

type Role = 'ADMIN' | 'MANAGER' | 'LEAD' | 'MID' | 'JUNIOR' | 'VIEWER';

/**
 * Hook for making authenticated API calls with automatic error handling.
 * Redirects to /auth/signin on 401 and /unauthorized on 403.
 */
export function useAuthFetch() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const authFetch = useCallback(async (url: string, options?: RequestInit) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (response.status === 401) {
      router.push('/auth/signin');
      throw new Error('Unauthorized - please sign in');
    }

    if (response.status === 403) {
      router.push('/unauthorized');
      throw new Error('Forbidden - insufficient permissions');
    }

    return response;
  }, [router]);

  return { authFetch, session, status };
}

/**
 * Hook for checking if the current user has a required role.
 * Optionally redirects to /unauthorized if not.
 */
export function useRequireRole(
  allowedRoles: Role[],
  options?: { redirect?: boolean }
) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);

  const userRole = session?.user?.role as Role | undefined;
  const isAuthorized = userRole ? allowedRoles.includes(userRole) : false;
  const isLoading = status === 'loading';

  useEffect(() => {
    if (!isLoading && !isAuthorized && options?.redirect && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/unauthorized');
    }
  }, [isLoading, isAuthorized, options?.redirect, router]);

  return { isAuthorized, isLoading, userRole, session };
}

/**
 * Simple role check utility (non-hook, for use in callbacks).
 */
export function hasRole(userRole: string | undefined, allowedRoles: string[]): boolean {
  return userRole ? allowedRoles.includes(userRole) : false;
}
