'use client';

import { useState } from 'react';
import { skillRequirements } from '@/lib/config/skill-requirements';
import {
    CAREER_GRADES,
    SOFT_SKILL_LABELS,
    HARD_SKILL_LABELS,
    CareerGrade,
    SoftSkill,
    HardSkill,
} from '@/lib/types';
import { SOFT_SKILLS, HARD_SKILLS } from '@/lib/config/skill-requirements';

export default function AdminPage() {
    const [selectedGrade, setSelectedGrade] = useState<CareerGrade>('Senior Engineer');
    const requirements = skillRequirements[selectedGrade];

    const getLevelBadge = (level: string) => {
        switch (level) {
            case 'Expert': return 'badge-success';
            case 'Proficient': return 'badge-info';
            case 'Developing': return 'badge-warning';
            default: return 'badge-ghost';
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Admin Configuration</h1>
                <p className="text-base-content/70">View and configure skill requirements for each career grade</p>
            </div>

            {/* Grade Selector */}
            <section className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title mb-4">Select Career Grade</h2>
                    <div className="flex flex-wrap gap-2">
                        {CAREER_GRADES.map((grade) => (
                            <button key={grade} onClick={() => setSelectedGrade(grade)}
                                className={`btn btn-sm ${selectedGrade === grade ? 'btn-primary' : 'btn-ghost'}`}>
                                {grade}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Soft Skills */}
                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-xl">💭</div>
                            <h2 className="card-title">Soft Skills Requirements</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr><th>Skill</th><th>Required</th><th>Weight</th></tr>
                                </thead>
                                <tbody>
                                    {SOFT_SKILLS.map((skill: SoftSkill) => (
                                        <tr key={skill}>
                                            <td className="font-medium">{SOFT_SKILL_LABELS[skill]}</td>
                                            <td><span className={`badge ${getLevelBadge(requirements.softSkills[skill].required)}`}>{requirements.softSkills[skill].required}</span></td>
                                            <td className="text-base-content/60">{requirements.softSkills[skill].weight}x</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Hard Skills */}
                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-xl">🔧</div>
                            <h2 className="card-title">Hard Skills Requirements</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr><th>Skill</th><th>Required</th><th>Weight</th></tr>
                                </thead>
                                <tbody>
                                    {HARD_SKILLS.map((skill: HardSkill) => (
                                        <tr key={skill}>
                                            <td className="font-medium">{HARD_SKILL_LABELS[skill]}</td>
                                            <td><span className={`badge ${getLevelBadge(requirements.hardSkills[skill].required)}`}>{requirements.hardSkills[skill].required}</span></td>
                                            <td className="text-base-content/60">{requirements.hardSkills[skill].weight}x</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Info Alert */}
            <div className="alert">
                <span className="text-xl">ℹ️</span>
                <div>
                    <h3 className="font-bold">Configuration Note</h3>
                    <p className="text-sm">Skill requirements are loaded from <code className="badge badge-ghost">lib/config/skill-requirements.ts</code>. Future versions will support editing through this interface.</p>
                </div>
            </div>
        </div>
    );
}
