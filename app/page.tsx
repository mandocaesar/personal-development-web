'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthFetch } from '@/lib/auth-helpers';
import type { TeamMemberAPI, AssessmentAPI } from '@/lib/api-types';

const ROLE_LABELS: Record<string, string> = {
  manager: 'Manager',
  lead: 'Team Lead',
  mid: 'Mid Engineer',
  junior: 'Junior',
};

export default function ManagerDashboard() {
  const { authFetch, status } = useAuthFetch();
  const [members, setMembers] = useState<TeamMemberAPI[]>([]);
  const [assessments, setAssessments] = useState<AssessmentAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamStats, setTeamStats] = useState({
    leads: 0,
    mid: 0,
    junior: 0,
    total: 0,
    assessed: 0,
    readyForPromotion: 0,
    needsCoaching: 0,
  });

  useEffect(() => {
    if (status !== 'authenticated') return;

    async function loadData() {
      try {
        const [membersRes, assessmentsRes] = await Promise.all([
          authFetch('/api/team-members'),
          authFetch('/api/assessments'),
        ]);

        const membersData: TeamMemberAPI[] = await membersRes.json();
        const assessmentsData: AssessmentAPI[] = await assessmentsRes.json();

        setMembers(membersData);
        setAssessments(assessmentsData.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));

        // Calculate stats
        const nonManagers = membersData.filter(m => m.role !== 'manager');
        const assessedMemberIds = new Set(assessmentsData.map(a => a.assesseeId));

        const latestByMember = new Map<string, AssessmentAPI>();
        assessmentsData.forEach(a => {
          const existing = latestByMember.get(a.assesseeId);
          if (!existing || new Date(a.createdAt) > new Date(existing.createdAt)) {
            latestByMember.set(a.assesseeId, a);
          }
        });

        const readyCount = Array.from(latestByMember.values()).filter(a => a.readinessScore >= 80).length;
        const needsCoachingCount = Array.from(latestByMember.values()).filter(a => a.readinessScore < 50).length;

        setTeamStats({
          leads: membersData.filter(m => m.role === 'lead').length,
          mid: membersData.filter(m => m.role === 'mid').length,
          junior: membersData.filter(m => m.role === 'junior').length,
          total: nonManagers.length,
          assessed: assessedMemberIds.size,
          readyForPromotion: readyCount,
          needsCoaching: needsCoachingCount,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [status, authFetch]);

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Get members needing assessment (never assessed or assessed > 30 days ago)
  const membersNeedingAssessment = members.filter(m => {
    if (m.role === 'manager') return false;
    const memberAssessments = assessments.filter(a => a.assesseeId === m.id);
    if (memberAssessments.length === 0) return true;
    const latest = memberAssessments[0];
    const daysSince = Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince > 30;
  }).slice(0, 5);

  const recentAssessments = assessments.slice(0, 5);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
        <p className="text-base-content/70">
          Overview of your team&apos;s skill progression and coaching activities
        </p>
      </div>

      {/* Main Stats */}
      <div className="stats shadow w-full bg-base-200">
        <div className="stat">
          <div className="stat-figure text-primary">👥</div>
          <div className="stat-title">Total Team</div>
          <div className="stat-value text-primary">{teamStats.total}</div>
          <div className="stat-desc">
            {teamStats.leads} leads • {teamStats.mid} mid • {teamStats.junior} junior
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-info">📋</div>
          <div className="stat-title">Assessed</div>
          <div className="stat-value text-info">{teamStats.assessed}</div>
          <div className="stat-desc">{teamStats.total - teamStats.assessed} pending</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-success">🚀</div>
          <div className="stat-title">Ready for Promotion</div>
          <div className="stat-value text-success">{teamStats.readyForPromotion}</div>
          <div className="stat-desc">80%+ readiness</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-warning">💬</div>
          <div className="stat-title">Needs Coaching</div>
          <div className="stat-value text-warning">{teamStats.needsCoaching}</div>
          <div className="stat-desc">&lt;50% readiness</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Assessment */}
        <section className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">📝 Needs Assessment</h2>
              <Link href="/team" className="btn btn-ghost btn-sm">View All</Link>
            </div>

            {membersNeedingAssessment.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-base-content/70">All team members assessed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {membersNeedingAssessment.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-base-300">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span>{member.avatarInitials}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-base-content/60">{ROLE_LABELS[member.role] || member.role}</p>
                      </div>
                    </div>
                    <Link href={`/team/${member.id}/assess`} className="btn btn-primary btn-sm">
                      Assess
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recent Assessments */}
        <section className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">📊 Recent Assessments</h2>
            </div>

            {recentAssessments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-base-content/70 mb-4">No assessments yet</p>
                <Link href="/team" className="btn btn-primary btn-sm">Start Assessing</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAssessments.map((assessment) => {
                  const member = members.find(m => m.id === assessment.assesseeId);
                  return (
                    <Link
                      key={assessment.id}
                      href={`/team/${assessment.assesseeId}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-base-300 hover:bg-base-300/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span>{member?.avatarInitials || assessment.assessee?.avatarInitials || '?'}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{member?.name || assessment.assessee?.name || 'Unknown'}</p>
                          <p className="text-xs text-base-content/60">
                            {new Date(assessment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`radial-progress text-sm ${assessment.readinessScore >= 80 ? 'text-success' :
                            assessment.readinessScore >= 50 ? 'text-info' : 'text-warning'
                          }`} style={{ "--value": assessment.readinessScore, "--size": "2.5rem", "--thickness": "3px" } as React.CSSProperties}>
                          {assessment.readinessScore}%
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/team" className="btn btn-outline btn-lg justify-start gap-3">
              <span className="text-xl">👥</span>
              <span>View All Team Members</span>
            </Link>
            <Link href="/calendar" className="btn btn-outline btn-lg justify-start gap-3">
              <span className="text-xl">📅</span>
              <span>Schedule 1-on-1</span>
            </Link>
            <Link href="/admin" className="btn btn-outline btn-lg justify-start gap-3">
              <span className="text-xl">⚙️</span>
              <span>Configure Skills</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
