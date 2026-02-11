'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';

const mockProjects: Project[] = [
    {
        id: '1',
        userId: 'user-1',
        title: 'E-commerce Platform Migration',
        explanation: 'Led the migration of legacy e-commerce platform to microservices architecture. Designed and implemented service mesh, API gateway, and event-driven communication patterns.',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        techStack: ['Node.js', 'TypeScript', 'Kubernetes', 'Redis', 'PostgreSQL'],
        teamSize: 8,
        role: 'Tech Lead',
        jiraLink: 'https://jira.company.com/browse/ECOM-1234',
        confluenceLink: 'https://confluence.company.com/display/TECH/Migration',
        skillsClaimed: ['systemDesign', 'devops', 'leadership'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-06-30T15:00:00Z',
    },
    {
        id: '2',
        userId: 'user-1',
        title: 'CI/CD Pipeline Overhaul',
        explanation: 'Redesigned the entire CI/CD pipeline to reduce deployment time by 70%. Implemented automated testing, security scanning, and canary deployments.',
        startDate: '2023-08-01',
        endDate: '2023-12-31',
        techStack: ['GitHub Actions', 'Docker', 'Terraform', 'ArgoCD'],
        teamSize: 4,
        role: 'Senior Engineer',
        skillsClaimed: ['devops', 'testing', 'security'],
        createdAt: '2023-08-01T10:00:00Z',
        updatedAt: '2023-12-31T15:00:00Z',
    },
];

export default function ProjectsPage() {
    const [projects] = useState<Project[]>(mockProjects);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Project Showcase</h1>
                    <p className="text-base-content/70">
                        Document your projects to claim skill proficiency with evidence
                    </p>
                </div>
                <Link href="/projects/new" className="btn btn-primary">
                    + Add Project
                </Link>
            </div>

            {/* Projects List */}
            {projects.length === 0 ? (
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body text-center py-12">
                        <div className="text-6xl mb-4">💼</div>
                        <h2 className="text-xl font-semibold mb-2">No Projects Yet</h2>
                        <p className="text-base-content/70 mb-4">
                            Add your projects to showcase your skills and claim proficiency levels.
                        </p>
                        <div className="card-actions justify-center">
                            <Link href="/projects/new" className="btn btn-primary">
                                Add Your First Project
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div key={project.id} className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="card-body">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="card-title">{project.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-base-content/60 mt-1">
                                            <span>{formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}</span>
                                            <span>•</span>
                                            <span>{project.teamSize} team members</span>
                                            <span>•</span>
                                            <span className="badge badge-outline badge-sm">{project.role}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-base-content/80 mb-4">{project.explanation}</p>

                                {/* Tech Stack */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-base-content/60 mb-2">Tech Stack</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech) => (
                                            <span key={tech} className="badge badge-ghost">{tech}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills Claimed */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-base-content/60 mb-2">Skills Demonstrated</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.skillsClaimed.map((skill) => (
                                            <span key={skill} className="badge badge-success badge-outline">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Links */}
                                {(project.jiraLink || project.confluenceLink) && (
                                    <div className="card-actions pt-4 border-t border-base-300">
                                        {project.jiraLink && (
                                            <a href={project.jiraLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                                                📋 JIRA
                                            </a>
                                        )}
                                        {project.confluenceLink && (
                                            <a href={project.confluenceLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                                                📄 Confluence
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
