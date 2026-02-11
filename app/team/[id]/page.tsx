'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuthFetch } from '@/lib/auth-helpers';
import type { TeamMemberAPI, AssessmentAPI } from '@/lib/api-types';
import { SOFT_SKILL_LABELS, HARD_SKILL_LABELS } from '@/lib/types';

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

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { authFetch, status } = useAuthFetch();
    const [member, setMember] = useState<TeamMemberAPI | null>(null);
    const [assessments, setAssessments] = useState<AssessmentAPI[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status !== 'authenticated') return;

        async function loadData() {
            try {
                const [memberRes, assessmentsRes] = await Promise.all([
                    authFetch(`/api/team-members/${id}`),
                    authFetch(`/api/assessments?assesseeId=${id}`),
                ]);

                if (memberRes.ok) {
                    setMember(await memberRes.json());
                }
                if (assessmentsRes.ok) {
                    const data: AssessmentAPI[] = await assessmentsRes.json();
                    setAssessments(data.sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    ));
                }
            } catch (error) {
                console.error('Error loading member data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id, status, authFetch]);

    if (loading || status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="animate-fade-in">
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body text-center py-12">
                        <div className="text-6xl mb-4">❓</div>
                        <h1 className="text-2xl font-bold mb-2">Member Not Found</h1>
                        <Link href="/team" className="btn btn-primary">Back to Team</Link>
                    </div>
                </div>
            </div>
        );
    }

    const latestAssessment = assessments[0];
    const latestSkills = latestAssessment ? JSON.parse(latestAssessment.skillsJson) : null;

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <Link href="/team" className="btn btn-ghost btn-sm mb-4">← Back to Team</Link>
                    <div className="flex items-center gap-4">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-16">
                                <span className="text-2xl">{member.avatarInitials}</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{member.name}</h1>
                            <p className="text-base-content/70">{member.email}</p>
                            <div className="flex gap-2 mt-2">
                                <span className={`badge ${ROLE_COLORS[member.role] || 'badge-ghost'}`}>{ROLE_LABELS[member.role] || member.role}</span>
                                <span className="badge badge-outline">{member.currentGrade}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Link href={`/team/${id}/assess`} className="btn btn-primary">
                    + New Assessment
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="stats shadow w-full bg-base-200">
                <div className="stat">
                    <div className="stat-title">Current Grade</div>
                    <div className="stat-value text-lg">{member.currentGrade}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Target Grade</div>
                    <div className="stat-value text-lg text-primary">{member.targetGrade}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Assessments</div>
                    <div className="stat-value text-lg">{assessments.length}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Readiness</div>
                    <div className="stat-value text-lg">
                        {latestAssessment ? `${latestAssessment.readinessScore}%` : 'N/A'}
                    </div>
                </div>
            </div>

            {/* Latest Assessment */}
            {latestAssessment && latestSkills && (
                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="card-title">Latest Assessment</h2>
                            <span className="text-sm text-base-content/60">
                                {new Date(latestAssessment.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Soft Skills */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <span>💭</span> Soft Skills
                                </h3>
                                <div className="space-y-2">
                                    {Object.entries(latestSkills.softSkills).map(([skill, level]) => (
                                        <div key={skill} className="flex items-center justify-between p-2 rounded bg-base-300">
                                            <span className="text-sm">{SOFT_SKILL_LABELS[skill as keyof typeof SOFT_SKILL_LABELS]}</span>
                                            <span className={`badge badge-sm ${level === 'Expert' ? 'badge-success' :
                                                    level === 'Proficient' ? 'badge-info' :
                                                        level === 'Developing' ? 'badge-warning' : 'badge-ghost'
                                                }`}>{level as string}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hard Skills */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <span>🔧</span> Hard Skills
                                </h3>
                                <div className="space-y-2">
                                    {Object.entries(latestSkills.hardSkills).map(([skill, level]) => (
                                        <div key={skill} className="flex items-center justify-between p-2 rounded bg-base-300">
                                            <span className="text-sm">{HARD_SKILL_LABELS[skill as keyof typeof HARD_SKILL_LABELS]}</span>
                                            <span className={`badge badge-sm ${level === 'Expert' ? 'badge-success' :
                                                    level === 'Proficient' ? 'badge-info' :
                                                        level === 'Developing' ? 'badge-warning' : 'badge-ghost'
                                                }`}>{level as string}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {latestAssessment.notes && (
                            <div className="mt-4 pt-4 border-t border-base-300">
                                <h3 className="font-semibold mb-2">Notes</h3>
                                <p className="text-base-content/80">{latestAssessment.notes}</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Assessment History */}
            <section className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title mb-4">Assessment History</h2>

                    {assessments.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">📋</div>
                            <p className="text-base-content/70 mb-4">No assessments yet</p>
                            <Link href={`/team/${id}/assess`} className="btn btn-primary">
                                Create First Assessment
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Assessor</th>
                                        <th>Readiness</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assessments.map((assessment) => (
                                        <tr key={assessment.id} className="hover">
                                            <td>{new Date(assessment.createdAt).toLocaleDateString()}</td>
                                            <td>{assessment.assessor?.name || 'Unknown'}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <progress
                                                        className="progress progress-primary w-16"
                                                        value={assessment.readinessScore}
                                                        max="100"
                                                    />
                                                    <span>{assessment.readinessScore}%</span>
                                                </div>
                                            </td>
                                            <td className="max-w-xs truncate">{assessment.notes || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
