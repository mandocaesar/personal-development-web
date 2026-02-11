'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthFetch } from '@/lib/auth-helpers';
import { GRADE_ENUM_TO_DISPLAY } from '@/lib/api-types';
import {
    CareerGrade,
    SkillAssessment,
    LearningRecommendation,
} from '@/lib/types';
import { analyzeProgression, createEmptyAssessment } from '@/lib/grading';
import { generateLearningPath } from '@/lib/learning';

export default function LearningPage() {
    const { authFetch, status } = useAuthFetch();
    const [currentGrade, setCurrentGrade] = useState<CareerGrade>('Senior Engineer');
    const [assessment, setAssessment] = useState<SkillAssessment>(createEmptyAssessment());
    const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [targetGrade, setTargetGrade] = useState<CareerGrade | null>(null);

    useEffect(() => {
        if (status !== 'authenticated') return;

        async function loadSelfAssessment() {
            try {
                const res = await authFetch('/api/self-assessments');
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        const displayGrade = GRADE_ENUM_TO_DISPLAY[data.grade] || data.grade;
                        if (displayGrade) setCurrentGrade(displayGrade as CareerGrade);
                        if (data.skills) setAssessment(data.skills);
                    }
                }
            } catch (error) {
                console.error('Failed to load assessment:', error);
            } finally {
                setLoaded(true);
            }
        }

        loadSelfAssessment();
    }, [status, authFetch]);

    useEffect(() => {
        if (loaded) {
            const result = analyzeProgression(currentGrade, assessment);
            if (result) {
                setTargetGrade(result.targetGrade);
                const learningPath = generateLearningPath(result.gaps);
                setRecommendations(learningPath);
            }
        }
    }, [currentGrade, assessment, loaded]);

    if (!loaded) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className="animate-fade-in">
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <h1 className="text-2xl font-bold mb-2">All Caught Up!</h1>
                        <p className="text-base-content/70 mb-4">
                            You meet all the requirements for your next career level.
                        </p>
                        <div className="card-actions justify-center">
                            <Link href="/assessment" className="btn btn-primary">
                                Review Your Assessment
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Learning Path</h1>
                <p className="text-base-content/70">
                    Personalized recommendations to help you reach <strong>{targetGrade}</strong>
                </p>
            </div>

            {/* Priority Legend */}
            <section className="card bg-base-200 shadow-lg">
                <div className="card-body py-4">
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <span className="badge badge-error">High</span>
                            <span className="text-sm text-base-content/70">Focus here first</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="badge badge-warning">Medium</span>
                            <span className="text-sm text-base-content/70">Important for growth</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="badge badge-info">Low</span>
                            <span className="text-sm text-base-content/70">Nice to have</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommendations by Priority */}
            {(['high', 'medium', 'low'] as const).map((priority) => {
                const items = recommendations.filter(r => r.priority === priority);
                if (items.length === 0) return null;

                const priorityConfig = {
                    high: { label: 'High Priority', badge: 'badge-error', icon: '🔴' },
                    medium: { label: 'Medium Priority', badge: 'badge-warning', icon: '🟡' },
                    low: { label: 'Low Priority', badge: 'badge-info', icon: '🔵' },
                };

                return (
                    <section key={priority}>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span>{priorityConfig[priority].icon}</span> {priorityConfig[priority].label}
                        </h2>
                        <div className="space-y-4">
                            {items.map((rec) => (
                                <div key={rec.skill} className="collapse collapse-arrow bg-base-200">
                                    <input type="checkbox" defaultChecked />
                                    <div className="collapse-title">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{rec.skillLabel}</h3>
                                            <span className="text-sm text-base-content/60">
                                                {rec.currentLevel} → {rec.targetLevel}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="collapse-content">
                                        <div className="pt-2">
                                            <h4 className="text-sm font-medium text-base-content/60 mb-3">Recommended Actions</h4>
                                            <ul className="space-y-2">
                                                {rec.recommendations.map((item, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <input type="checkbox" className="checkbox checkbox-sm checkbox-primary mt-1" />
                                                        <span className="text-sm text-base-content/80">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })}

            {/* Actions */}
            <div className="flex gap-4 justify-center">
                <Link href="/projects/new" className="btn btn-primary">
                    Add Project Evidence →
                </Link>
                <Link href="/results" className="btn btn-ghost">
                    View Progress
                </Link>
            </div>
        </div>
    );
}
