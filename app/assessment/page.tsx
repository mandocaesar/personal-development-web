'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthFetch } from '@/lib/auth-helpers';
import { GRADE_DISPLAY_TO_ENUM, GRADE_ENUM_TO_DISPLAY } from '@/lib/api-types';
import {
    CAREER_GRADES,
    PROFICIENCY_LEVELS,
    SOFT_SKILL_LABELS,
    HARD_SKILL_LABELS,
    CareerGrade,
    ProficiencyLevel,
    SkillAssessment,
    SoftSkill,
    HardSkill,
} from '@/lib/types';
import { createEmptyAssessment } from '@/lib/grading';
import { SOFT_SKILLS, HARD_SKILLS } from '@/lib/config/skill-requirements';

export default function AssessmentPage() {
    const { authFetch, status } = useAuthFetch();
    const [selectedGrade, setSelectedGrade] = useState<CareerGrade>('Senior Engineer');
    const [assessment, setAssessment] = useState<SkillAssessment>(createEmptyAssessment());
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [loaded, setLoaded] = useState(false);

    // Load from API on mount
    useEffect(() => {
        if (status !== 'authenticated') return;

        async function loadSelfAssessment() {
            try {
                const res = await authFetch('/api/self-assessments');
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        const displayGrade = GRADE_ENUM_TO_DISPLAY[data.grade] || data.grade;
                        if (displayGrade) setSelectedGrade(displayGrade as CareerGrade);
                        if (data.skills) setAssessment(data.skills);
                        if (data.updatedAt) setLastSaved(new Date(data.updatedAt));
                    }
                }
            } catch (error) {
                console.error('Failed to load self-assessment:', error);
            } finally {
                setLoaded(true);
            }
        }

        loadSelfAssessment();
    }, [status, authFetch]);

    // Auto-save on changes (debounced)
    const saveToAPI = useCallback(async (grade: CareerGrade, skills: SkillAssessment) => {
        if (!loaded) return;
        setIsSaving(true);
        try {
            const gradeEnum = GRADE_DISPLAY_TO_ENUM[grade] || 'SENIOR_ENGINEER';
            await authFetch('/api/self-assessments', {
                method: 'POST',
                body: JSON.stringify({
                    grade: gradeEnum,
                    skills,
                }),
            });
            setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save self-assessment:', error);
        } finally {
            setIsSaving(false);
        }
    }, [loaded, authFetch]);

    useEffect(() => {
        if (!loaded) return;
        const saveTimeout = setTimeout(() => {
            saveToAPI(selectedGrade, assessment);
        }, 1000);
        return () => clearTimeout(saveTimeout);
    }, [selectedGrade, assessment, loaded, saveToAPI]);

    const updateSoftSkill = (skill: SoftSkill, level: ProficiencyLevel) => {
        setAssessment((prev) => ({
            ...prev,
            softSkills: { ...prev.softSkills, [skill]: level },
        }));
    };

    const updateHardSkill = (skill: HardSkill, level: ProficiencyLevel) => {
        setAssessment((prev) => ({
            ...prev,
            hardSkills: { ...prev.hardSkills, [skill]: level },
        }));
    };

    const getLevelClass = (level: ProficiencyLevel, isSelected: boolean) => {
        if (!isSelected) return 'btn-ghost';
        switch (level) {
            case 'Not Yet': return 'btn-neutral';
            case 'Developing': return 'btn-warning';
            case 'Proficient': return 'btn-info';
            case 'Expert': return 'btn-success';
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Self Assessment</h1>
                    <p className="text-base-content/70">
                        Rate your current proficiency level for each competency
                    </p>
                </div>
                <div className="text-right">
                    {isSaving ? (
                        <span className="badge badge-ghost">Saving...</span>
                    ) : lastSaved ? (
                        <span className="badge badge-success gap-1">
                            ✓ Saved {lastSaved.toLocaleTimeString()}
                        </span>
                    ) : null}
                </div>
            </div>

            {/* Career Grade Selection */}
            <section className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title mb-4">Your Current Career Grade</h2>
                    <div className="flex flex-wrap gap-2">
                        {CAREER_GRADES.map((grade) => (
                            <button
                                key={grade}
                                onClick={() => setSelectedGrade(grade)}
                                className={`btn btn-sm ${selectedGrade === grade ? 'btn-primary' : 'btn-ghost'
                                    }`}
                            >
                                {grade}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Soft Skills Assessment */}
            <section className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-xl">
                            💭
                        </div>
                        <div>
                            <h2 className="card-title">Soft Skills</h2>
                            <p className="text-sm text-base-content/60">Interpersonal and management competencies</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {SOFT_SKILLS.map((skill) => (
                            <div key={skill} className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">{SOFT_SKILL_LABELS[skill]}</span>
                                </label>
                                <div className="join">
                                    {PROFICIENCY_LEVELS.map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => updateSoftSkill(skill, level)}
                                            className={`join-item btn btn-sm ${getLevelClass(level, assessment.softSkills[skill] === level)}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hard Skills Assessment */}
            <section className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-xl">
                            🔧
                        </div>
                        <div>
                            <h2 className="card-title">Hard Skills</h2>
                            <p className="text-sm text-base-content/60">Technical competencies</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {HARD_SKILLS.map((skill) => (
                            <div key={skill} className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">{HARD_SKILL_LABELS[skill]}</span>
                                </label>
                                <div className="join">
                                    {PROFICIENCY_LEVELS.map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => updateHardSkill(skill, level)}
                                            className={`join-item btn btn-sm ${getLevelClass(level, assessment.hardSkills[skill] === level)}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* View Results CTA */}
            <div className="flex justify-center">
                <a href="/results" className="btn btn-primary btn-lg">
                    View My Progression Analysis →
                </a>
            </div>
        </div>
    );
}
