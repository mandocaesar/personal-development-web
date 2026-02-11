'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthFetch } from '@/lib/auth-helpers';
import {
    SOFT_SKILL_LABELS,
    HARD_SKILL_LABELS,
    SkillType,
} from '@/lib/types';
import { SOFT_SKILLS, HARD_SKILLS } from '@/lib/config/skill-requirements';

export default function NewProjectPage() {
    const router = useRouter();
    const { authFetch } = useAuthFetch();
    const [formData, setFormData] = useState({
        title: '',
        explanation: '',
        startDate: '',
        endDate: '',
        techStack: '',
        teamSize: '',
        role: '',
        jiraLink: '',
        confluenceLink: '',
        skillsClaimed: [] as SkillType[],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const res = await authFetch('/api/projects', {
                method: 'POST',
                body: JSON.stringify({
                    title: formData.title,
                    explanation: formData.explanation,
                    startDate: formData.startDate,
                    endDate: formData.endDate || null,
                    techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
                    teamSize: parseInt(formData.teamSize),
                    role: formData.role,
                    jiraLink: formData.jiraLink || null,
                    confluenceLink: formData.confluenceLink || null,
                    skillsClaimed: formData.skillsClaimed,
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save project');
            }
        } catch (err) {
            console.error('Error saving project:', err);
            setError('Failed to save project');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSkill = (skill: SkillType) => {
        setFormData(prev => ({
            ...prev,
            skillsClaimed: prev.skillsClaimed.includes(skill)
                ? prev.skillsClaimed.filter(s => s !== skill)
                : [...prev.skillsClaimed, skill]
        }));
    };

    if (submitted) {
        return (
            <div className="animate-fade-in">
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body text-center py-12">
                        <div className="text-6xl mb-4">✅</div>
                        <h1 className="text-2xl font-bold mb-2">Project Added!</h1>
                        <p className="text-base-content/70 mb-6">
                            Your project has been saved and skills have been claimed.
                        </p>
                        <div className="card-actions justify-center">
                            <Link href="/projects" className="btn btn-primary">View All Projects</Link>
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setFormData({
                                        title: '', explanation: '', startDate: '', endDate: '',
                                        techStack: '', teamSize: '', role: '', jiraLink: '',
                                        confluenceLink: '', skillsClaimed: [],
                                    });
                                }}
                                className="btn btn-ghost"
                            >
                                Add Another
                            </button>
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
                <Link href="/projects" className="btn btn-ghost btn-sm mb-4">← Back to Projects</Link>
                <h1 className="text-3xl font-bold mb-2">Add New Project</h1>
                <p className="text-base-content/70">Document your project to claim skill proficiency with evidence</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Project Details</h2>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Project Title *</span></label>
                            <input type="text" className="input input-bordered" placeholder="E.g., E-commerce Platform Migration"
                                value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Your Contribution *</span></label>
                            <textarea className="textarea textarea-bordered min-h-[120px]" placeholder="Describe what you did, your role, and your key contributions..."
                                value={formData.explanation} onChange={(e) => setFormData({ ...formData, explanation: e.target.value })} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Start Date *</span></label>
                                <input type="date" className="input input-bordered"
                                    value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">End Date</span></label>
                                <input type="date" className="input input-bordered"
                                    value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Team Size *</span></label>
                                <input type="number" className="input input-bordered" placeholder="E.g., 5" min="1"
                                    value={formData.teamSize} onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })} required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Your Role *</span></label>
                                <input type="text" className="input input-bordered" placeholder="E.g., Tech Lead"
                                    value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Tech Stack</span></label>
                            <input type="text" className="input input-bordered" placeholder="E.g., React, Node.js (comma-separated)"
                                value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} />
                        </div>
                    </div>
                </section>

                {/* Links */}
                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Reference Links</h2>
                        <div className="form-control">
                            <label className="label"><span className="label-text">JIRA Link</span></label>
                            <input type="url" className="input input-bordered" placeholder="https://jira.company.com/..."
                                value={formData.jiraLink} onChange={(e) => setFormData({ ...formData, jiraLink: e.target.value })} />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Documentation Link</span></label>
                            <input type="url" className="input input-bordered" placeholder="https://confluence.company.com/..."
                                value={formData.confluenceLink} onChange={(e) => setFormData({ ...formData, confluenceLink: e.target.value })} />
                        </div>
                    </div>
                </section>

                {/* Skills Claimed */}
                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-2">Skills Demonstrated</h2>
                        <p className="text-sm text-base-content/60 mb-4">Select the skills this project demonstrates</p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium mb-2">Soft Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {SOFT_SKILLS.map((skill) => (
                                        <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                                            className={`btn btn-sm ${formData.skillsClaimed.includes(skill) ? 'btn-info' : 'btn-ghost'}`}>
                                            {SOFT_SKILL_LABELS[skill]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium mb-2">Hard Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {HARD_SKILLS.map((skill) => (
                                        <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                                            className={`btn btn-sm ${formData.skillsClaimed.includes(skill) ? 'btn-success' : 'btn-ghost'}`}>
                                            {HARD_SKILL_LABELS[skill]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Submit */}
                <div className="card-actions justify-end">
                    <Link href="/projects" className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Save Project'}
                    </button>
                </div>
            </form>
        </div>
    );
}
