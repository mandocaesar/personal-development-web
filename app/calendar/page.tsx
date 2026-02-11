'use client';

import { useState, useEffect } from 'react';
import { useAuthFetch } from '@/lib/auth-helpers';
import type { TeamMemberAPI, CoachingSessionAPI } from '@/lib/api-types';

export default function CalendarPage() {
    const { authFetch, status } = useAuthFetch();
    const [sessions, setSessions] = useState<CoachingSessionAPI[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMemberAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newSession, setNewSession] = useState({
        memberId: '',
        date: '',
        time: '10:00',
        duration: 30,
        topic: '',
    });

    useEffect(() => {
        if (status !== 'authenticated') return;

        async function loadData() {
            try {
                const [sessionsRes, membersRes] = await Promise.all([
                    authFetch('/api/coaching-sessions'),
                    authFetch('/api/team-members'),
                ]);

                if (sessionsRes.ok) {
                    setSessions(await sessionsRes.json());
                }
                if (membersRes.ok) {
                    const members: TeamMemberAPI[] = await membersRes.json();
                    setTeamMembers(members.filter(m => m.role !== 'manager'));
                }
            } catch (error) {
                console.error('Error loading calendar data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [status, authFetch]);

    const handleSaveSession = async () => {
        if (!newSession.memberId || !newSession.date || !newSession.topic) return;

        try {
            const res = await authFetch('/api/coaching-sessions', {
                method: 'POST',
                body: JSON.stringify({
                    memberId: newSession.memberId,
                    scheduledAt: `${newSession.date}T${newSession.time}:00`,
                    duration: newSession.duration,
                    topic: newSession.topic,
                }),
            });

            if (res.ok) {
                const created: CoachingSessionAPI = await res.json();
                setSessions(prev => [...prev, created]);
                setShowModal(false);
                setNewSession({ memberId: '', date: '', time: '10:00', duration: 30, topic: '' });
            }
        } catch (error) {
            console.error('Error saving session:', error);
        }
    };

    const updateSessionStatus = async (sessionId: string, newStatus: 'COMPLETED' | 'CANCELLED') => {
        try {
            const res = await authFetch(`/api/coaching-sessions/${sessionId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setSessions(prev => prev.map(s =>
                    s.id === sessionId ? { ...s, status: newStatus } : s
                ));
            }
        } catch (error) {
            console.error('Error updating session:', error);
        }
    };

    if (loading || status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const upcomingSessions = sessions
        .filter(s => s.status === 'SCHEDULED' && new Date(s.scheduledAt) >= new Date())
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

    const pastSessions = sessions
        .filter(s => s.status !== 'SCHEDULED' || new Date(s.scheduledAt) < new Date())
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">1-on-1 Coaching</h1>
                    <p className="text-base-content/70">Schedule and manage coaching sessions with your team</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    + Schedule Session
                </button>
            </div>

            {/* Stats */}
            <div className="stats shadow bg-base-200 w-full">
                <div className="stat">
                    <div className="stat-figure text-primary">📅</div>
                    <div className="stat-title">Upcoming</div>
                    <div className="stat-value text-primary">{upcomingSessions.length}</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-success">✅</div>
                    <div className="stat-title">Completed</div>
                    <div className="stat-value text-success">{sessions.filter(s => s.status === 'COMPLETED').length}</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-base-content/50">❌</div>
                    <div className="stat-title">Cancelled</div>
                    <div className="stat-value">{sessions.filter(s => s.status === 'CANCELLED').length}</div>
                </div>
            </div>

            {/* Upcoming Sessions */}
            <section className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title mb-4">📅 Upcoming Sessions</h2>

                    {upcomingSessions.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">📆</div>
                            <p className="text-base-content/70 mb-4">No upcoming sessions</p>
                            <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
                                Schedule Now
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingSessions.map((session) => {
                                const member = teamMembers.find(m => m.id === session.memberId) || session.member;
                                const date = new Date(session.scheduledAt);
                                return (
                                    <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-base-300">
                                        <div className="flex items-center gap-4">
                                            <div className="text-center min-w-[60px]">
                                                <p className="text-2xl font-bold">{date.getDate()}</p>
                                                <p className="text-xs text-base-content/60">
                                                    {date.toLocaleDateString('en-US', { month: 'short' })}
                                                </p>
                                            </div>
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                    <span>{member?.avatarInitials || '?'}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium">{member?.name || 'Unknown'}</p>
                                                <p className="text-sm text-base-content/60">
                                                    {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {session.duration} min
                                                </p>
                                                <p className="text-sm font-medium text-primary">{session.topic}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateSessionStatus(session.id, 'COMPLETED')}
                                                className="btn btn-success btn-sm"
                                            >
                                                Complete
                                            </button>
                                            <button
                                                onClick={() => updateSessionStatus(session.id, 'CANCELLED')}
                                                className="btn btn-ghost btn-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Past Sessions */}
            {pastSessions.length > 0 && (
                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-4">📋 Past Sessions</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Team Member</th>
                                        <th>Topic</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastSessions.slice(0, 10).map((session) => (
                                        <tr key={session.id} className="hover">
                                            <td>{new Date(session.scheduledAt).toLocaleDateString()}</td>
                                            <td>{session.member?.name || teamMembers.find(m => m.id === session.memberId)?.name || 'Unknown'}</td>
                                            <td>{session.topic}</td>
                                            <td>{session.duration} min</td>
                                            <td>
                                                <span className={`badge ${session.status === 'COMPLETED' ? 'badge-success' :
                                                        session.status === 'CANCELLED' ? 'badge-error' : 'badge-warning'
                                                    }`}>
                                                    {session.status.toLowerCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Schedule 1-on-1 Session</h3>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Team Member</span></label>
                                <select
                                    className="select select-bordered"
                                    value={newSession.memberId}
                                    onChange={(e) => setNewSession({ ...newSession, memberId: e.target.value })}
                                >
                                    <option value="">Select team member...</option>
                                    {teamMembers.map((member) => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Date</span></label>
                                    <input
                                        type="date"
                                        className="input input-bordered"
                                        value={newSession.date}
                                        onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Time</span></label>
                                    <input
                                        type="time"
                                        className="input input-bordered"
                                        value={newSession.time}
                                        onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Duration</span></label>
                                <select
                                    className="select select-bordered"
                                    value={newSession.duration}
                                    onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
                                >
                                    <option value={15}>15 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>60 minutes</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Topic</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    placeholder="e.g., Skill Gap Review, Career Planning..."
                                    value={newSession.topic}
                                    onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveSession}>Schedule</button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
                </div>
            )}
        </div>
    );
}
