'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TEAM_MEMBERS, AssessmentRecord, ROLE_LABELS, STORAGE_KEYS } from '@/lib/team-data';
import {
    PROFICIENCY_LEVELS,
    SOFT_SKILL_LABELS,
    HARD_SKILL_LABELS,
    ProficiencyLevel,
    SkillAssessment,
    SoftSkill,
    HardSkill,
} from '@/lib/types';
import { SOFT_SKILLS, HARD_SKILLS } from '@/lib/config/skill-requirements';
import { createEmptyAssessment, analyzeProgression } from '@/lib/grading';
import { Question, getQuestionsBySkill } from '@/lib/question-bank';
import Whiteboard from '@/components/Whiteboard';
import ResizablePanels from '@/components/ResizablePanels';

type SkillType = SoftSkill | HardSkill;

interface TopicAnswer {
    skill: SkillType;
    questionId: string;
    answer: string;
    diagram?: string;
    rating: ProficiencyLevel;
    timeSpent: number; // seconds
}

export default function AssessMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const member = TEAM_MEMBERS.find(m => m.id === id);

    const [step, setStep] = useState<'topics' | 'interview' | 'summary'>('topics');
    const [selectedTopics, setSelectedTopics] = useState<Set<SkillType>>(new Set());
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
    const [assessment, setAssessment] = useState<SkillAssessment>(createEmptyAssessment());
    const [answers, setAnswers] = useState<Map<SkillType, TopicAnswer>>(new Map());
    const [selectedQuestions, setSelectedQuestions] = useState<Map<SkillType, Question>>(new Map());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timer, setTimer] = useState(0);
    const [showHints, setShowHints] = useState(false);
    const [activeTab, setActiveTab] = useState<'question' | 'whiteboard'>('question');
    const [finalNotes, setFinalNotes] = useState('');
    const [overallRating, setOverallRating] = useState<'strong_no' | 'no' | 'maybe' | 'yes' | 'strong_yes'>('maybe');
    const [savedAssessment, setSavedAssessment] = useState<AssessmentRecord | null>(null);

    // Timer
    useEffect(() => {
        if (step === 'interview') {
            const interval = setInterval(() => setTimer(t => t + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [step]);

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

    const selectedTopicsArray = Array.from(selectedTopics);
    const currentTopic = selectedTopicsArray[currentTopicIndex];
    const currentQuestion = selectedQuestions.get(currentTopic);
    const isSoftSkill = SOFT_SKILLS.includes(currentTopic as SoftSkill);
    const skillLabel = isSoftSkill
        ? SOFT_SKILL_LABELS[currentTopic as SoftSkill]
        : HARD_SKILL_LABELS[currentTopic as HardSkill];

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTopic = (skill: SkillType) => {
        const newSet = new Set(selectedTopics);
        if (newSet.has(skill)) {
            newSet.delete(skill);
        } else {
            newSet.add(skill);
        }
        setSelectedTopics(newSet);
    };

    const startInterview = () => {
        // Select a random question for each topic
        const questions = new Map<SkillType, Question>();
        selectedTopics.forEach(skill => {
            const skillQuestions = getQuestionsBySkill(skill);
            if (skillQuestions.length > 0) {
                const randomQ = skillQuestions[Math.floor(Math.random() * skillQuestions.length)];
                questions.set(skill, randomQ);
            }
        });
        setSelectedQuestions(questions);
        setStep('interview');
    };

    const updateAnswer = (text: string) => {
        setAnswers(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(currentTopic) || {
                skill: currentTopic,
                questionId: currentQuestion?.id || '',
                answer: '',
                rating: 'Not Yet' as ProficiencyLevel,
                timeSpent: timer,
            };
            newMap.set(currentTopic, { ...existing, answer: text });
            return newMap;
        });
    };

    const updateDiagram = (diagram: string) => {
        setAnswers(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(currentTopic);
            if (existing) {
                newMap.set(currentTopic, { ...existing, diagram });
            }
            return newMap;
        });
    };

    const updateRating = (level: ProficiencyLevel) => {
        if (isSoftSkill) {
            setAssessment(prev => ({
                ...prev,
                softSkills: { ...prev.softSkills, [currentTopic]: level },
            }));
        } else {
            setAssessment(prev => ({
                ...prev,
                hardSkills: { ...prev.hardSkills, [currentTopic]: level },
            }));
        }
        setAnswers(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(currentTopic) || {
                skill: currentTopic,
                questionId: currentQuestion?.id || '',
                answer: '',
                rating: 'Not Yet' as ProficiencyLevel,
                timeSpent: timer,
            };
            newMap.set(currentTopic, { ...existing, rating: level });
            return newMap;
        });
    };

    const getCurrentRating = (): ProficiencyLevel => {
        if (isSoftSkill) {
            return assessment.softSkills[currentTopic as SoftSkill];
        }
        return assessment.hardSkills[currentTopic as HardSkill];
    };

    const getCurrentAnswer = (): string => {
        return answers.get(currentTopic)?.answer || '';
    };

    const goToNext = () => {
        // Save time spent
        setAnswers(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(currentTopic);
            if (existing) {
                newMap.set(currentTopic, { ...existing, timeSpent: timer });
            }
            return newMap;
        });

        if (currentTopicIndex < selectedTopicsArray.length - 1) {
            setCurrentTopicIndex(prev => prev + 1);
            setShowHints(false);
            setActiveTab('question');
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);

        const result = analyzeProgression(member.currentGrade, assessment);
        const readinessScore = result?.readinessPercentage || 0;

        // Compile notes with questions and answers
        const allNotes = Array.from(answers.values())
            .map(a => {
                const q = selectedQuestions.get(a.skill);
                const label = SOFT_SKILLS.includes(a.skill as SoftSkill)
                    ? SOFT_SKILL_LABELS[a.skill as SoftSkill]
                    : HARD_SKILL_LABELS[a.skill as HardSkill];
                return `[${label}]\nQ: ${q?.question || 'N/A'}\nA: ${a.answer}\nRating: ${a.rating}\nTime: ${formatTime(a.timeSpent)}`;
            })
            .join('\n\n---\n\n');

        const newAssessment: AssessmentRecord = {
            id: `assessment-${Date.now()}`,
            memberId: member.id,
            assessorId: 'mgr-1',
            assessorName: 'You (Manager)',
            date: new Date().toISOString(),
            grade: member.currentGrade,
            skills: assessment,
            notes: allNotes,
            readinessScore: readinessScore,
        };

        setSavedAssessment(newAssessment);
        setIsSubmitting(false);
        setStep('summary');
    };

    const handleFinalSubmit = () => {
        if (!savedAssessment) return;

        // Add final notes and overall rating to assessment
        const finalAssessment: AssessmentRecord = {
            ...savedAssessment,
            notes: savedAssessment.notes + `\n\n=== FINAL EVALUATION ===\nOverall: ${overallRating.toUpperCase()}\n${finalNotes}`,
        };

        const saved = localStorage.getItem(STORAGE_KEYS.assessments);
        const all: AssessmentRecord[] = saved ? JSON.parse(saved) : [];
        all.push(finalAssessment);
        localStorage.setItem(STORAGE_KEYS.assessments, JSON.stringify(all));

        router.push(`/team/${id}`);
    };

    const ratingOptions = [
        { value: 'strong_no', label: 'Strong No', color: 'btn-error', icon: '👎👎' },
        { value: 'no', label: 'No', color: 'btn-warning', icon: '👎' },
        { value: 'maybe', label: 'Maybe', color: 'btn-ghost', icon: '🤔' },
        { value: 'yes', label: 'Yes', color: 'btn-info', icon: '👍' },
        { value: 'strong_yes', label: 'Strong Yes', color: 'btn-success', icon: '👍👍' },
    ] as const;

    // Evaluation Summary
    if (step === 'summary') {
        return (
            <div className="fixed inset-0 z-50 bg-base-100 flex flex-col">
                <div className="h-14 bg-base-200 border-b border-base-300 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                                <span className="text-sm">{member.avatarInitials}</span>
                            </div>
                        </div>
                        <span className="font-medium">{member.name}</span>
                        <span className="badge badge-primary">Evaluation</span>
                    </div>
                    <div className="font-mono text-lg bg-base-300 px-4 py-1 rounded">
                        Total: {formatTime(timer)}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2">Interview Complete</h1>
                            <p className="text-base-content/70">Review your assessment and provide final evaluation</p>
                        </div>

                        {/* Skills Summary */}
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">📊 Skills Assessed</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {Array.from(answers.values()).map((answer) => {
                                        const isSoft = SOFT_SKILLS.includes(answer.skill as SoftSkill);
                                        const label = isSoft
                                            ? SOFT_SKILL_LABELS[answer.skill as SoftSkill]
                                            : HARD_SKILL_LABELS[answer.skill as HardSkill];
                                        return (
                                            <div key={answer.skill} className="bg-base-300 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`badge badge-sm ${isSoft ? 'badge-info' : 'badge-success'}`}>
                                                        {isSoft ? 'Soft' : 'Hard'}
                                                    </span>
                                                    <span className="font-medium text-sm">{label}</span>
                                                </div>
                                                <div className={`badge ${answer.rating === 'Expert' ? 'badge-success' :
                                                    answer.rating === 'Proficient' ? 'badge-info' :
                                                        answer.rating === 'Developing' ? 'badge-warning' : 'badge-ghost'
                                                    }`}>
                                                    {answer.rating}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Overall Rating */}
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">🎯 Overall Recommendation</h2>
                                <p className="text-sm text-base-content/60 mb-4">
                                    Based on the interview, what is your overall recommendation?
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {ratingOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setOverallRating(option.value)}
                                            className={`btn ${overallRating === option.value ? option.color : 'btn-outline'} min-w-28`}
                                        >
                                            <span className="text-lg">{option.icon}</span>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Final Notes */}
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">📝 Final Notes</h2>
                                <textarea
                                    className="textarea textarea-bordered w-full h-32"
                                    placeholder="Add any final thoughts, key observations, or recommendations..."
                                    value={finalNotes}
                                    onChange={(e) => setFinalNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setStep('interview')}
                                className="btn btn-ghost"
                            >
                                ← Back to Interview
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                className="btn btn-primary btn-lg"
                            >
                                ✅ Save Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Topic Selection
    if (step === 'topics') {
        return (
            <div className="animate-fade-in space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/team/${id}`} className="btn btn-ghost btn-sm">←</Link>
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-12">
                                <span className="text-lg">{member.avatarInitials}</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Interview: {member.name}</h1>
                            <p className="text-sm text-base-content/70">Select topics to assess</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Soft Skills */}
                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title text-info mb-4">💭 Soft Skills</h2>
                            <div className="space-y-2">
                                {SOFT_SKILLS.map((skill) => {
                                    const questions = getQuestionsBySkill(skill);
                                    return (
                                        <label
                                            key={skill}
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${selectedTopics.has(skill) ? 'bg-info/20 border border-info' : 'bg-base-300 hover:bg-base-300/70'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-info checkbox-sm"
                                                checked={selectedTopics.has(skill)}
                                                onChange={() => toggleTopic(skill)}
                                            />
                                            <div className="flex-1">
                                                <span className="font-medium">{SOFT_SKILL_LABELS[skill]}</span>
                                                <span className="text-xs text-base-content/50 ml-2">({questions.length} questions)</span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Hard Skills */}
                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title text-success mb-4">🔧 Hard Skills</h2>
                            <div className="space-y-2">
                                {HARD_SKILLS.map((skill) => {
                                    const questions = getQuestionsBySkill(skill);
                                    return (
                                        <label
                                            key={skill}
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${selectedTopics.has(skill) ? 'bg-success/20 border border-success' : 'bg-base-300 hover:bg-base-300/70'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-success checkbox-sm"
                                                checked={selectedTopics.has(skill)}
                                                onChange={() => toggleTopic(skill)}
                                            />
                                            <div className="flex-1">
                                                <span className="font-medium">{HARD_SKILL_LABELS[skill]}</span>
                                                <span className="text-xs text-base-content/50 ml-2">({questions.length} questions)</span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-base-content/70">
                        {selectedTopics.size === 0 ? 'Select at least one topic' : `${selectedTopics.size} topic(s) selected`}
                    </span>
                    <button
                        onClick={startInterview}
                        disabled={selectedTopics.size === 0}
                        className="btn btn-primary"
                    >
                        🎯 Start Interview
                    </button>
                </div>
            </div>
        );
    }

    // HackerRank-style Interview UI
    return (
        <div className="fixed inset-0 z-50 bg-base-100 flex flex-col">
            {/* Top Bar */}
            <div className="h-14 bg-base-200 border-b border-base-300 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStep('topics')} className="btn btn-ghost btn-sm">← Exit</button>
                    <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                                <span className="text-sm">{member.avatarInitials}</span>
                            </div>
                        </div>
                        <span className="font-medium">{member.name}</span>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2">
                    {selectedTopicsArray.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentTopicIndex(idx)}
                            className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${idx === currentTopicIndex ? 'bg-primary text-primary-content' :
                                idx < currentTopicIndex ? 'bg-success text-success-content' : 'bg-base-300'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Timer */}
                <div className="flex items-center gap-4">
                    <div className="font-mono text-lg bg-base-300 px-3 py-1 rounded">
                        ⏱️ {formatTime(timer)}
                    </div>
                    {currentTopicIndex === selectedTopicsArray.length - 1 ? (
                        <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary btn-sm">
                            {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : '✅ Submit'}
                        </button>
                    ) : (
                        <button onClick={goToNext} className="btn btn-primary btn-sm">Next →</button>
                    )}
                </div>
            </div>

            {/* Main Content - Resizable Split Pane */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanels
                    defaultLeftWidth={50}
                    minLeftWidth={30}
                    minRightWidth={30}
                    left={
                        <div className="h-full flex flex-col border-r border-base-300">
                            <div className="p-4 bg-base-200 border-b border-base-300 shrink-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`badge ${isSoftSkill ? 'badge-info' : 'badge-success'}`}>
                                        {isSoftSkill ? 'Soft Skill' : 'Hard Skill'}
                                    </span>
                                    <span className="badge badge-outline">{currentQuestion?.level || 'N/A'}</span>
                                    <span className="badge badge-ghost">{currentQuestion?.type || 'N/A'}</span>
                                </div>
                                <h2 className="text-lg font-bold">{skillLabel}</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {currentQuestion ? (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-medium mb-4">{currentQuestion.question}</h3>
                                            {currentQuestion.context && (
                                                <div className="alert bg-base-200 mb-4">
                                                    <span className="text-sm">📋 {currentQuestion.context}</span>
                                                </div>
                                            )}
                                        </div>

                                        {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                                            <div>
                                                <button
                                                    onClick={() => setShowHints(!showHints)}
                                                    className="btn btn-ghost btn-sm"
                                                >
                                                    {showHints ? '🙈 Hide Hints' : '💡 Show Hints'}
                                                </button>
                                                {showHints && (
                                                    <ul className="mt-2 space-y-1">
                                                        {currentQuestion.hints.map((hint, i) => (
                                                            <li key={i} className="text-sm text-base-content/70 flex items-start gap-2">
                                                                <span className="text-warning">•</span> {hint}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}

                                        {currentQuestion.expectedPoints && (
                                            <div className="collapse collapse-arrow bg-base-200">
                                                <input type="checkbox" />
                                                <div className="collapse-title font-medium">📝 Expected Points (Evaluator Guide)</div>
                                                <div className="collapse-content">
                                                    <ul className="space-y-1">
                                                        {currentQuestion.expectedPoints.map((point, i) => (
                                                            <li key={i} className="text-sm flex items-start gap-2">
                                                                <input type="checkbox" className="checkbox checkbox-xs mt-1" />
                                                                <span>{point}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-sm text-base-content/50">
                                            ⏱️ Estimated time: {currentQuestion.timeEstimate} min
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-base-content/50">
                                        No question available for this topic
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                    right={
                        <div className="h-full flex flex-col bg-base-300/30">
                            {/* Tabs */}
                            <div className="tabs tabs-boxed bg-base-200 rounded-none shrink-0">
                                <button
                                    onClick={() => setActiveTab('question')}
                                    className={`tab ${activeTab === 'question' ? 'tab-active' : ''}`}
                                >
                                    📝 Response
                                </button>
                                <button
                                    onClick={() => setActiveTab('whiteboard')}
                                    className={`tab ${activeTab === 'whiteboard' ? 'tab-active' : ''}`}
                                >
                                    🎨 Whiteboard
                                </button>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                {activeTab === 'question' ? (
                                    <div className="h-full flex flex-col p-4">
                                        <textarea
                                            className="textarea textarea-bordered flex-1 w-full font-mono text-sm resize-none"
                                            placeholder="Record the candidate's response here...

Notes:
- Key points mentioned
- Quality of explanation
- Areas of strength/weakness"
                                            value={getCurrentAnswer()}
                                            onChange={(e) => updateAnswer(e.target.value)}
                                        />

                                        {/* Rating */}
                                        <div className="mt-4">
                                            <label className="label">
                                                <span className="label-text font-medium">Performance Rating</span>
                                            </label>
                                            <div className="join w-full">
                                                {PROFICIENCY_LEVELS.map((level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => updateRating(level)}
                                                        className={`join-item btn flex-1 btn-sm ${getCurrentRating() === level
                                                            ? level === 'Expert' ? 'btn-success' :
                                                                level === 'Proficient' ? 'btn-info' :
                                                                    level === 'Developing' ? 'btn-warning' : 'btn-neutral'
                                                            : 'btn-ghost'
                                                            }`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full p-4">
                                        <Whiteboard
                                            onSave={updateDiagram}
                                            initialData={answers.get(currentTopic)?.diagram}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    );
}
