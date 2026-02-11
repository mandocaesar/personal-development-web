// Career Grades
export type CareerGrade =
    | 'Associate Engineer'
    | 'Engineer'
    | 'Senior Engineer'
    | 'Lead Engineer'
    | 'Associate Principal Engineer'
    | 'Engineering Manager'
    | 'Principal Engineer'
    | 'Engineering Division Head';

// Proficiency Levels
export type ProficiencyLevel = 'Not Yet' | 'Developing' | 'Proficient' | 'Expert';

export const PROFICIENCY_SCORES: Record<ProficiencyLevel, number> = {
    'Not Yet': 0,
    'Developing': 1,
    'Proficient': 2,
    'Expert': 3,
};

// Soft Skills
export type SoftSkill =
    | 'interpersonal'
    | 'projectManagement'
    | 'problemSolving'
    | 'leadership';

// Hard Skills
export type HardSkill =
    | 'coding'
    | 'systemDesign'
    | 'devops'
    | 'testing'
    | 'databases'
    | 'security';

export type SkillType = SoftSkill | HardSkill;

// Skill Requirement Configuration
export interface SkillRequirement {
    required: ProficiencyLevel;
    weight: number;
}

export interface LevelRequirements {
    softSkills: Record<SoftSkill, SkillRequirement>;
    hardSkills: Record<HardSkill, SkillRequirement>;
}

// User Assessment
export interface SkillAssessment {
    softSkills: Record<SoftSkill, ProficiencyLevel>;
    hardSkills: Record<HardSkill, ProficiencyLevel>;
}

export interface User {
    id: string;
    name: string;
    email: string;
    currentGrade: CareerGrade;
    assessment?: SkillAssessment;
    createdAt: string;
    updatedAt: string;
}

// Project
export interface Project {
    id: string;
    userId: string;
    title: string;
    explanation: string;
    startDate: string;
    endDate?: string;
    techStack: string[];
    teamSize: number;
    role: string;
    jiraLink?: string;
    confluenceLink?: string;
    skillsClaimed: SkillType[];
    createdAt: string;
    updatedAt: string;
}

// Gap Analysis Result
export interface GapAnalysisResult {
    skill: SkillType;
    skillLabel: string;
    category: 'soft' | 'hard';
    current: ProficiencyLevel;
    required: ProficiencyLevel;
    gap: number;
    weight: number;
}

export interface ProgressionResult {
    currentGrade: CareerGrade;
    targetGrade: CareerGrade;
    readinessPercentage: number;
    gaps: GapAnalysisResult[];
    strengths: GapAnalysisResult[];
}

// Learning Recommendation
export interface LearningRecommendation {
    skill: SkillType;
    skillLabel: string;
    currentLevel: ProficiencyLevel;
    targetLevel: ProficiencyLevel;
    priority: 'high' | 'medium' | 'low';
    recommendations: string[];
}

// Skill Labels for Display
export const SOFT_SKILL_LABELS: Record<SoftSkill, string> = {
    interpersonal: 'Interpersonal Skills',
    projectManagement: 'Project Management',
    problemSolving: 'Problem Solving & Decision Making',
    leadership: 'Leadership',
};

export const HARD_SKILL_LABELS: Record<HardSkill, string> = {
    coding: 'Coding & Programming',
    systemDesign: 'System Design & Architecture',
    devops: 'DevOps & Infrastructure',
    testing: 'Testing & Quality',
    databases: 'Data & Databases',
    security: 'Security',
};

export const CAREER_GRADES: CareerGrade[] = [
    'Associate Engineer',
    'Engineer',
    'Senior Engineer',
    'Lead Engineer',
    'Associate Principal Engineer',
    'Engineering Manager',
    'Principal Engineer',
    'Engineering Division Head',
];

export const PROFICIENCY_LEVELS: ProficiencyLevel[] = [
    'Not Yet',
    'Developing',
    'Proficient',
    'Expert',
];
