'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface NavItem {
    href: string;
    label: string;
    icon: string;
    roles?: string[]; // if undefined, visible to all authenticated users
}

const navItems: NavItem[] = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/team', label: 'My Team', icon: '👥', roles: ['ADMIN', 'MANAGER', 'LEAD'] },
    { href: '/users', label: 'User Management', icon: '👤', roles: ['ADMIN', 'MANAGER'] },
    { href: '/calendar', label: 'Coaching', icon: '📅' },
    { href: '/admin', label: 'Config', icon: '⚙️', roles: ['ADMIN'] },
];

export default function Navigation() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const handleSignOut = () => {
        signOut({ callbackUrl: '/auth/signin' });
    };

    const userRole = session?.user?.role || '';

    // Filter nav items by role
    const visibleNavItems = navItems.filter(item => {
        if (!item.roles) return true; // no role restriction
        return item.roles.includes(userRole);
    });

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-base-200 border-r border-base-300 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-base-300">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-xl">🎯</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Skill Tracker</h1>
                        <p className="text-xs text-base-content/60">
                            {userRole === 'ADMIN' ? 'Admin Portal' :
                             userRole === 'MANAGER' ? 'Manager Portal' :
                             'Team Portal'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="menu menu-lg gap-1">
                    {visibleNavItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={isActive ? 'active bg-primary/10 text-primary' : ''}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Divider */}
                <div className="divider my-4 text-xs text-base-content/50">Quick Access</div>

                {/* Quick Actions */}
                <ul className="menu gap-1">
                    <li>
                        <Link href="/team" className="text-sm">
                            <span>➕</span> Assess Team Member
                        </Link>
                    </li>
                    <li>
                        <Link href="/calendar" className="text-sm">
                            <span>📆</span> Schedule 1-on-1
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-base-300">
                {status === 'authenticated' && session?.user ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-10">
                                    <span className="text-lg">
                                        {session.user.name?.charAt(0) || '👤'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{session.user.name}</p>
                                <p className="text-xs text-base-content/60 truncate">{session.user.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="btn btn-sm btn-ghost w-full justify-start"
                        >
                            <span>🚪</span>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-10">
                                <span className="text-lg">👔</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Loading...</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
