'use client';

import { useState, useEffect, use } from 'react';
import { TEAM_MEMBERS } from '@/lib/team-data';
import { SOFT_SKILL_LABELS, HARD_SKILL_LABELS, SoftSkill, HardSkill } from '@/lib/types';
import { SOFT_SKILLS } from '@/lib/config/skill-requirements';
import { Question, getQuestionsBySkill } from '@/lib/question-bank';
import DiagramWhiteboard from '@/components/Whiteboard';
import ResizablePanels from '@/components/ResizablePanels';

type SkillType = SoftSkill | HardSkill;

export default function IntervieweePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const member = TEAM_MEMBERS.find(m => m.id === id);

    const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [timer, setTimer] = useState(0);
    const [isStarted, setIsStarted] = useState(false);

    // Timer
    useEffect(() => {
        if (isStarted) {
            const interval = setInterval(() => setTimer(t => t + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [isStarted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const loadQuestion = (skill: SkillType) => {
        const questions = getQuestionsBySkill(skill);
        if (questions.length > 0) {
            const randomQ = questions[Math.floor(Math.random() * questions.length)];
            setCurrentQuestion(randomQ);
            setSelectedSkill(skill);
            setIsStarted(true);
        }
    };

    if (!member) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
                    <p className="text-base-content/70">Please ask your interviewer for the correct link.</p>
                </div>
            </div>
        );
    }

    const isSoftSkill = selectedSkill ? SOFT_SKILLS.includes(selectedSkill as SoftSkill) : false;
    const skillLabel = selectedSkill
        ? isSoftSkill
            ? SOFT_SKILL_LABELS[selectedSkill as SoftSkill]
            : HARD_SKILL_LABELS[selectedSkill as HardSkill]
        : '';

    // Welcome screen before starting
    if (!isStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-8">
                <div className="max-w-2xl w-full text-center space-y-8">
                    <div className="space-y-4">
                        <div className="text-6xl">🎯</div>
                        <h1 className="text-4xl font-bold">Technical Interview</h1>
                        <p className="text-xl text-base-content/70">Welcome, {member.name}</p>
                    </div>

                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title justify-center mb-4">Select a Topic to Begin</h2>
                            <p className="text-sm text-base-content/60 mb-6">
                                Your interviewer will guide you through the assessment.
                                Use the whiteboard to draw diagrams and explain your solutions.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-info mb-2">💭 Soft Skills</h3>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {(['interpersonal', 'projectManagement', 'problemSolving', 'leadership'] as SoftSkill[]).map(skill => (
                                            <button
                                                key={skill}
                                                onClick={() => loadQuestion(skill)}
                                                className="btn btn-sm btn-outline btn-info"
                                            >
                                                {SOFT_SKILL_LABELS[skill]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="divider">or</div>

                                <div>
                                    <h3 className="font-medium text-success mb-2">🔧 Hard Skills</h3>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {(['coding', 'systemDesign', 'devops', 'testing', 'databases', 'security'] as HardSkill[]).map(skill => (
                                            <button
                                                key={skill}
                                                onClick={() => loadQuestion(skill)}
                                                className="btn btn-sm btn-outline btn-success"
                                            >
                                                {HARD_SKILL_LABELS[skill]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-base-content/40">
                        This is the interviewee view. Your interviewer has a separate panel for notes.
                    </p>
                </div>
            </div>
        );
    }

    // Interview in progress
    return (
        <div className="fixed inset-0 z-50 bg-base-100 flex flex-col">
            {/* Top Bar */}
            <div className="h-12 bg-base-200 border-b border-base-300 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-8">
                                <span className="text-sm">{member.avatarInitials}</span>
                            </div>
                        </div>
                        <span className="font-medium">{member.name}</span>
                    </div>
                    <span className={`badge ${isSoftSkill ? 'badge-info' : 'badge-success'}`}>
                        {skillLabel}
                    </span>
                </div>

                <div className="font-mono text-lg bg-base-300 px-4 py-1 rounded">
                    ⏱️ {formatTime(timer)}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanels
                    defaultLeftWidth={40}
                    minLeftWidth={25}
                    minRightWidth={35}
                    left={
                        <div className="h-full flex flex-col bg-base-200/50">
                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="badge badge-outline">{currentQuestion?.level}</span>
                                            <span className="badge badge-ghost">{currentQuestion?.type}</span>
                                        </div>
                                        <h2 className="text-2xl font-medium leading-relaxed">
                                            {currentQuestion?.question}
                                        </h2>
                                    </div>

                                    {currentQuestion?.context && (
                                        <div className="alert bg-base-300">
                                            <span>📋 {currentQuestion.context}</span>
                                        </div>
                                    )}

                                    {currentQuestion?.hints && (
                                        <div className="space-y-2">
                                            <h3 className="font-medium text-warning">💡 Hints</h3>
                                            <ul className="space-y-1">
                                                {currentQuestion.hints.map((hint, i) => (
                                                    <li key={i} className="text-sm text-base-content/70 flex items-start gap-2">
                                                        <span className="text-warning">•</span> {hint}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="text-sm text-base-content/50">
                                        ⏱️ Estimated time: {currentQuestion?.timeEstimate} min
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    right={
                        <div className="h-full p-4 bg-base-300/30">
                            <DiagramWhiteboard />
                        </div>
                    }
                />
            </div>
        </div>
    );
}
