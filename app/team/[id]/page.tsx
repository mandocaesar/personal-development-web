'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { TEAM_MEMBERS, AssessmentRecord, ROLE_LABELS, ROLE_COLORS, STORAGE_KEYS } from '@/lib/team-data';
import { SOFT_SKILL_LABELS, HARD_SKILL_LABELS } from '@/lib/types';

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const member = TEAM_MEMBERS.find(m => m.id === id);
    const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);

    useEffect(() => {
        // Load assessments from localStorage
        const saved = localStorage.getItem(STORAGE_KEYS.assessments);
        if (saved) {
            const all: AssessmentRecord[] = JSON.parse(saved);
            setAssessments(all.filter(a => a.memberId === id).sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
        }
    }, [id]);

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
                                <span className={`badge ${ROLE_COLORS[member.role]}`}>{ROLE_LABELS[member.role]}</span>
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
            {latestAssessment && (
                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="card-title">Latest Assessment</h2>
                            <span className="text-sm text-base-content/60">
                                {new Date(latestAssessment.date).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Soft Skills */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <span>💭</span> Soft Skills
                                </h3>
                                <div className="space-y-2">
                                    {Object.entries(latestAssessment.skills.softSkills).map(([skill, level]) => (
                                        <div key={skill} className="flex items-center justify-between p-2 rounded bg-base-300">
                                            <span className="text-sm">{SOFT_SKILL_LABELS[skill as keyof typeof SOFT_SKILL_LABELS]}</span>
                                            <span className={`badge badge-sm ${level === 'Expert' ? 'badge-success' :
                                                    level === 'Proficient' ? 'badge-info' :
                                                        level === 'Developing' ? 'badge-warning' : 'badge-ghost'
                                                }`}>{level}</span>
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
                                    {Object.entries(latestAssessment.skills.hardSkills).map(([skill, level]) => (
                                        <div key={skill} className="flex items-center justify-between p-2 rounded bg-base-300">
                                            <span className="text-sm">{HARD_SKILL_LABELS[skill as keyof typeof HARD_SKILL_LABELS]}</span>
                                            <span className={`badge badge-sm ${level === 'Expert' ? 'badge-success' :
                                                    level === 'Proficient' ? 'badge-info' :
                                                        level === 'Developing' ? 'badge-warning' : 'badge-ghost'
                                                }`}>{level}</span>
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
                                            <td>{new Date(assessment.date).toLocaleDateString()}</td>
                                            <td>{assessment.assessorName}</td>
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
