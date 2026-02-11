// Shared types for API responses used by frontend pages
// These map Prisma data to the format the UI expects

import type { CareerGrade, SkillAssessment } from './types';

export interface TeamMemberAPI {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'lead' | 'mid' | 'junior';
  currentGrade: string;
  targetGrade: string;
  avatarInitials: string;
  joinedAt: string;
  dbRole?: string;
}

export interface AssessmentAPI {
  id: string;
  assesseeId: string;
  assessorId: string;
  grade: string;
  skillsJson: string;
  notes: string;
  readinessScore: number;
  createdAt: string;
  updatedAt: string;
  assessee?: {
    id: string;
    name: string;
    email: string;
    avatarInitials: string;
    currentGrade: string;
    targetGrade: string;
    role: string;
  };
  assessor?: {
    id: string;
    name: string;
    email: string;
    avatarInitials: string;
  };
}

export interface CoachingSessionAPI {
  id: string;
  memberId: string;
  scheduledAt: string;
  duration: number;
  topic: string;
  notes: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  member?: {
    id: string;
    name: string;
    email: string;
    avatarInitials: string;
  };
}

export interface ProjectAPI {
  id: string;
  userId: string;
  title: string;
  explanation: string;
  startDate: string;
  endDate: string | null;
  techStack: string[];
  teamSize: number;
  role: string;
  jiraLink: string | null;
  confluenceLink: string | null;
  skillsClaimed: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SelfAssessmentAPI {
  id: string;
  userId: string;
  grade: string;
  skillsJson: string;
  skills: SkillAssessment;
  createdAt: string;
  updatedAt: string;
}

// Grade mapping helpers (Prisma enum <-> display string)
export const GRADE_ENUM_TO_DISPLAY: Record<string, CareerGrade> = {
  ASSOCIATE_ENGINEER: 'Associate Engineer',
  ENGINEER: 'Engineer',
  SENIOR_ENGINEER: 'Senior Engineer',
  LEAD_ENGINEER: 'Lead Engineer',
  ASSOCIATE_PRINCIPAL_ENGINEER: 'Associate Principal Engineer',
  PRINCIPAL_ENGINEER: 'Principal Engineer',
  ENGINEERING_MANAGER: 'Engineering Manager',
  ENGINEERING_DIVISION_HEAD: 'Engineering Division Head',
};

export const GRADE_DISPLAY_TO_ENUM: Record<string, string> = Object.fromEntries(
  Object.entries(GRADE_ENUM_TO_DISPLAY).map(([k, v]) => [v, k])
);
