'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthFetch } from '@/lib/auth-helpers';
import type { TeamMemberAPI } from '@/lib/api-types';

type RoleFilter = 'all' | 'lead' | 'mid' | 'junior';

const ROLE_LABELS: Record<string, string> = {
    manager: 'Manager',
    lead: 'Team Lead',
    mid: 'Mid Engineer',
    junior: 'Junior',
};

const ROLE_COLORS: Record<string, string> = {
    manager: 'badge-primary',
    lead: 'badge-secondary',
    mid: 'badge-info',
    junior: 'badge-warning',
};

export default function TeamPage() {
    const { authFetch, status } = useAuthFetch();
    const [members, setMembers] = useState<TeamMemberAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (status !== 'authenticated') return;

        async function loadMembers() {
            try {
                const res = await authFetch('/api/team-members');
                const data: TeamMemberAPI[] = await res.json();
                setMembers(data);
            } catch (error) {
                console.error('Error loading team members:', error);
            } finally {
                setLoading(false);
            }
        }

        loadMembers();
    }, [status, authFetch]);

    if (loading || status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const filteredMembers = members.filter(member => {
        if (member.role === 'manager') return false;
        if (roleFilter !== 'all' && member.role !== roleFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return member.name.toLowerCase().includes(query) ||
                member.email.toLowerCase().includes(query);
        }
        return true;
    });

    const teamStats = {
        leads: members.filter(m => m.role === 'lead').length,
        mid: members.filter(m => m.role === 'mid').length,
        junior: members.filter(m => m.role === 'junior').length,
    };

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">My Team</h1>
                <p className="text-base-content/70">
                    Assess and track the progression of your team members
                </p>
            </div>

            {/* Stats */}
            <div className="stats shadow w-full bg-base-200">
                <div className="stat">
                    <div className="stat-figure text-secondary">👥</div>
                    <div className="stat-title">Team Leads</div>
                    <div className="stat-value text-secondary">{teamStats.leads}</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-info">💻</div>
                    <div className="stat-title">Mid Engineers</div>
                    <div className="stat-value text-info">{teamStats.mid}</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-warning">🌱</div>
                    <div className="stat-title">Juniors</div>
                    <div className="stat-value text-warning">{teamStats.junior}</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-primary">📊</div>
                    <div className="stat-title">Total</div>
                    <div className="stat-value text-primary">{teamStats.leads + teamStats.mid + teamStats.junior}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="card bg-base-200 shadow-lg">
                <div className="card-body py-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="form-control flex-1">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="input input-bordered"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="join">
                            <button
                                className={`join-item btn btn-sm ${roleFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setRoleFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`join-item btn btn-sm ${roleFilter === 'lead' ? 'btn-secondary' : 'btn-ghost'}`}
                                onClick={() => setRoleFilter('lead')}
                            >
                                Leads
                            </button>
                            <button
                                className={`join-item btn btn-sm ${roleFilter === 'mid' ? 'btn-info' : 'btn-ghost'}`}
                                onClick={() => setRoleFilter('mid')}
                            >
                                Mid
                            </button>
                            <button
                                className={`join-item btn btn-sm ${roleFilter === 'junior' ? 'btn-warning' : 'btn-ghost'}`}
                                onClick={() => setRoleFilter('junior')}
                            >
                                Junior
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                    <div key={member.id} className="card bg-base-200 shadow-lg hover:shadow-xl transition-all">
                        <div className="card-body">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                                        <span className="text-lg">{member.avatarInitials}</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold truncate">{member.name}</h3>
                                    <p className="text-sm text-base-content/60 truncate">{member.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`badge badge-sm ${ROLE_COLORS[member.role] || 'badge-ghost'}`}>
                                            {ROLE_LABELS[member.role] || member.role}
                                        </span>
                                        <span className="badge badge-sm badge-outline">{member.currentGrade}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-base-300">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-base-content/60">Target:</span>
                                    <span className="font-medium">{member.targetGrade}</span>
                                </div>
                            </div>

                            <div className="card-actions justify-end mt-2">
                                <Link href={`/team/${member.id}`} className="btn btn-ghost btn-sm">
                                    View Profile
                                </Link>
                                <Link href={`/team/${member.id}/assess`} className="btn btn-primary btn-sm">
                                    Assess
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMembers.length === 0 && (
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body text-center py-12">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-base-content/70">No team members found matching your criteria</p>
                    </div>
                </div>
            )}
        </div>
    );
}
