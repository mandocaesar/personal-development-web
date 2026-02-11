'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthFetch } from '@/lib/auth-helpers';
import { GRADE_ENUM_TO_DISPLAY } from '@/lib/api-types';
import {
    CareerGrade,
    SkillAssessment,
    ProgressionResult,
} from '@/lib/types';
import { analyzeProgression, createEmptyAssessment } from '@/lib/grading';

export default function ResultsPage() {
    const { authFetch, status } = useAuthFetch();
    const [currentGrade, setCurrentGrade] = useState<CareerGrade>('Senior Engineer');
    const [assessment, setAssessment] = useState<SkillAssessment>(createEmptyAssessment());
    const [result, setResult] = useState<ProgressionResult | null>(null);
    const [loaded, setLoaded] = useState(false);

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
            const progressionResult = analyzeProgression(currentGrade, assessment);
            setResult(progressionResult);
        }
    }, [currentGrade, assessment, loaded]);

    if (!loaded) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="animate-fade-in">
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body text-center py-12">
                        <div className="text-6xl mb-4">🎉</div>
                        <h1 className="text-2xl font-bold mb-2">Congratulations!</h1>
                        <p className="text-base-content/70 mb-4">
                            You&apos;ve reached the highest career grade: <strong>{currentGrade}</strong>
                        </p>
                        <p className="text-base-content/60">
                            Continue to mentor others and shape the engineering culture.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Career Progression Analysis</h1>
                <p className="text-base-content/70">
                    Your readiness for advancement from <strong>{result.currentGrade}</strong> to <strong>{result.targetGrade}</strong>
                </p>
            </div>

            {/* Readiness Score */}
            <section className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="card-title">Readiness Score</h2>
                        <div className={`radial-progress ${result.readinessPercentage >= 80 ? 'text-success' :
                                result.readinessPercentage >= 60 ? 'text-info' :
                                    result.readinessPercentage >= 40 ? 'text-warning' :
                                        'text-error'
                            }`} style={{ "--value": result.readinessPercentage, "--size": "4rem" } as React.CSSProperties} role="progressbar">
                            {result.readinessPercentage}%
                        </div>
                    </div>
                    <progress className="progress progress-primary w-full h-4" value={result.readinessPercentage} max="100"></progress>
                    <div className="flex justify-between mt-2 text-sm text-base-content/60">
                        <span>{result.currentGrade}</span>
                        <span>{result.targetGrade}</span>
                    </div>
                </div>
            </section>

            {/* Progression Path */}
            <section className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title mb-4">Your Progression Path</h2>
                    <ul className="steps steps-horizontal w-full">
                        <li className="step step-primary">
                            <span className="text-xs">{result.currentGrade}</span>
                        </li>
                        <li className={`step ${result.readinessPercentage >= 80 ? 'step-primary' : ''}`}>
                            <span className="text-xs">{result.targetGrade}</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Skill Gaps */}
            {result.gaps.length > 0 && (
                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="card-title">Areas for Improvement</h2>
                            <span className="badge badge-warning">{result.gaps.length} gaps</span>
                        </div>
                        <div className="space-y-4">
                            {result.gaps.map((gap) => (
                                <div key={gap.skill} className="alert">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium">{gap.skillLabel}</h3>
                                            <span className={`badge badge-sm ${gap.category === 'soft' ? 'badge-info' : 'badge-success'}`}>
                                                {gap.category === 'soft' ? 'Soft Skill' : 'Hard Skill'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="badge badge-ghost">{gap.current}</span>
                                            <span>→</span>
                                            <span className="badge badge-primary">{gap.required}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Strengths */}
            {result.strengths.length > 0 && (
                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="card-title">Your Strengths</h2>
                            <span className="badge badge-success">{result.strengths.length} on track</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {result.strengths.map((strength) => (
                                <div key={strength.skill} className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                                    <span className="text-success">✓</span>
                                    <div>
                                        <p className="font-medium text-sm">{strength.skillLabel}</p>
                                        <p className="text-xs text-base-content/60">{strength.current}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center">
                <Link href="/learning" className="btn btn-primary">
                    View Learning Recommendations →
                </Link>
                <Link href="/assessment" className="btn btn-ghost">
                    Update Assessment
                </Link>
            </div>
        </div>
    );
}
