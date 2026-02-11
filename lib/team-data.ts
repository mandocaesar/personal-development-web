import { CareerGrade, ProficiencyLevel, SkillAssessment, SoftSkill, HardSkill } from './types';

export type UserRole = 'manager' | 'lead' | 'mid' | 'junior';

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    currentGrade: CareerGrade;
    targetGrade: CareerGrade;
    avatarInitials: string;
    joinedAt: string;
}

export interface AssessmentRecord {
    id: string;
    memberId: string;
    assessorId: string;
    assessorName: string;
    date: string;
    grade: CareerGrade;
    skills: SkillAssessment;
    notes: string;
    readinessScore: number;
}

export interface CoachingSession {
    id: string;
    memberId: string;
    memberName: string;
    scheduledAt: string;
    duration: number; // minutes
    topic: string;
    notes: string;
    status: 'scheduled' | 'completed' | 'cancelled';
}

// Your team members
export const TEAM_MEMBERS: TeamMember[] = [
    // Manager (You)
    { id: 'mgr-1', name: 'You (Manager)', email: 'manager@company.com', role: 'manager', currentGrade: 'Engineering Manager', targetGrade: 'Engineering Division Head', avatarInitials: 'YM', joinedAt: '2020-01-15' },

    // Team Leads (2)
    { id: 'lead-1', name: 'Alice Chen', email: 'alice@company.com', role: 'lead', currentGrade: 'Lead Engineer', targetGrade: 'Associate Principal Engineer', avatarInitials: 'AC', joinedAt: '2021-03-10' },
    { id: 'lead-2', name: 'Bob Martinez', email: 'bob@company.com', role: 'lead', currentGrade: 'Lead Engineer', targetGrade: 'Associate Principal Engineer', avatarInitials: 'BM', joinedAt: '2021-06-22' },

    // Mid Engineers (8)
    { id: 'mid-1', name: 'Carol Wu', email: 'carol@company.com', role: 'mid', currentGrade: 'Senior Engineer', targetGrade: 'Lead Engineer', avatarInitials: 'CW', joinedAt: '2022-01-05' },
    { id: 'mid-2', name: 'David Kim', email: 'david@company.com', role: 'mid', currentGrade: 'Senior Engineer', targetGrade: 'Lead Engineer', avatarInitials: 'DK', joinedAt: '2022-02-14' },
    { id: 'mid-3', name: 'Emma Johnson', email: 'emma@company.com', role: 'mid', currentGrade: 'Senior Engineer', targetGrade: 'Lead Engineer', avatarInitials: 'EJ', joinedAt: '2022-04-01' },
    { id: 'mid-4', name: 'Frank Lee', email: 'frank@company.com', role: 'mid', currentGrade: 'Engineer', targetGrade: 'Senior Engineer', avatarInitials: 'FL', joinedAt: '2022-06-15' },
    { id: 'mid-5', name: 'Grace Park', email: 'grace@company.com', role: 'mid', currentGrade: 'Engineer', targetGrade: 'Senior Engineer', avatarInitials: 'GP', joinedAt: '2022-08-20' },
    { id: 'mid-6', name: 'Henry Zhang', email: 'henry@company.com', role: 'mid', currentGrade: 'Engineer', targetGrade: 'Senior Engineer', avatarInitials: 'HZ', joinedAt: '2022-10-01' },
    { id: 'mid-7', name: 'Ivy Patel', email: 'ivy@company.com', role: 'mid', currentGrade: 'Senior Engineer', targetGrade: 'Lead Engineer', avatarInitials: 'IP', joinedAt: '2023-01-10' },
    { id: 'mid-8', name: 'Jack Thompson', email: 'jack@company.com', role: 'mid', currentGrade: 'Engineer', targetGrade: 'Senior Engineer', avatarInitials: 'JT', joinedAt: '2023-03-15' },

    // Juniors (9)
    { id: 'jr-1', name: 'Karen Liu', email: 'karen@company.com', role: 'junior', currentGrade: 'Associate Engineer', targetGrade: 'Engineer', avatarInitials: 'KL', joinedAt: '2023-06-01' },
    { id: 'jr-2', name: 'Leo Garcia', email: 'leo@company.com', role: 'junior', currentGrade: 'Associate Engineer', targetGrade: 'Engineer', avatarInitials: 'LG', joinedAt: '2023-07-15' },
    { id: 'jr-3', name: 'Mia Wilson', email: 'mia@company.com', role: 'junior', currentGrade: 'Associate Engineer', targetGrade: 'Engineer', avatarInitials: 'MW', joinedAt: '2023-08-01' },
    { id: 'jr-4', name: 'Noah Brown', email: 'noah@company.com', role: 'junior', currentGrade: 'Associate Engineer', targetGrade: 'Engineer', avatarInitials: 'NB', joinedAt: '2023-09-10' },
    { id: 'jr-5', name: 'Olivia Davis', email: 'olivia@company.com', role: 'junior', currentGrade: 'Associate Engineer', targetGrade: 'Engineer', avatarInitials: 'OD', joinedAt: '2023-10-15' },
    { id: 'jr-6', name: 'Peter Anderson', email: 'peter@company.com', role: 'junior', currentGrade: 'Associate Engineer', targetGrade: 'Engineer', avatarInitials: 'PA', joinedAt: '2023-11-01' },
    { id: 'jr-7', name: 'Quinn Taylor', email: 'quinn@company.com', role: 'junior', currentGrade: 'Associate Engineer', targetGrade: 'Engineer', avatarInitials: 'QT', joinedAt: '2024-01-05' },
    { id: 'jr-8', name: 'Rosa Hernandez', email: 'rosa@company.com', role: 'junior', currentGrade: 'Associate Engineer', targetGrade: 'Engineer', avatarInitials: 'RH', joinedAt: '2024-02-10' },
    { id: 'jr-9', name: 'Sam Miller', email: 'sam@company.com', role: 'junior', currentGrade: 'Associate Engineer', targetGrade: 'Engineer', avatarInitials: 'SM', joinedAt: '2024-03-01' },
];

// Helper to get role display name
export const ROLE_LABELS: Record<UserRole, string> = {
    manager: 'Manager',
    lead: 'Team Lead',
    mid: 'Mid Engineer',
    junior: 'Junior',
};

// Helper to get role color
export const ROLE_COLORS: Record<UserRole, string> = {
    manager: 'badge-primary',
    lead: 'badge-secondary',
    mid: 'badge-info',
    junior: 'badge-warning',
};

// Storage keys
export const STORAGE_KEYS = {
    assessments: 'skill-tracker-assessments',
    coaching: 'skill-tracker-coaching',
    currentUser: 'skill-tracker-current-user',
};
