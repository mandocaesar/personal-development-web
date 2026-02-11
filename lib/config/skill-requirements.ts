import {
    CareerGrade,
    LevelRequirements,
    SoftSkill,
    HardSkill,
} from '../types';

// Skill requirements per career level based on SWEG-HR Engineering Competencies
export const skillRequirements: Record<CareerGrade, LevelRequirements> = {
    'Associate Engineer': {
        softSkills: {
            interpersonal: { required: 'Developing', weight: 1 },
            projectManagement: { required: 'Not Yet', weight: 0.5 },
            problemSolving: { required: 'Not Yet', weight: 0.5 },
            leadership: { required: 'Not Yet', weight: 0.5 },
        },
        hardSkills: {
            coding: { required: 'Developing', weight: 1.5 },
            systemDesign: { required: 'Not Yet', weight: 0.5 },
            devops: { required: 'Not Yet', weight: 0.5 },
            testing: { required: 'Developing', weight: 1 },
            databases: { required: 'Not Yet', weight: 0.5 },
            security: { required: 'Not Yet', weight: 0.5 },
        },
    },
    'Engineer': {
        softSkills: {
            interpersonal: { required: 'Developing', weight: 1 },
            projectManagement: { required: 'Developing', weight: 1 },
            problemSolving: { required: 'Developing', weight: 1 },
            leadership: { required: 'Not Yet', weight: 0.5 },
        },
        hardSkills: {
            coding: { required: 'Proficient', weight: 1.5 },
            systemDesign: { required: 'Developing', weight: 1 },
            devops: { required: 'Developing', weight: 1 },
            testing: { required: 'Proficient', weight: 1 },
            databases: { required: 'Developing', weight: 1 },
            security: { required: 'Developing', weight: 0.5 },
        },
    },
    'Senior Engineer': {
        softSkills: {
            interpersonal: { required: 'Proficient', weight: 1 },
            projectManagement: { required: 'Proficient', weight: 1 },
            problemSolving: { required: 'Proficient', weight: 1.5 },
            leadership: { required: 'Developing', weight: 1 },
        },
        hardSkills: {
            coding: { required: 'Expert', weight: 1.5 },
            systemDesign: { required: 'Proficient', weight: 1.5 },
            devops: { required: 'Proficient', weight: 1 },
            testing: { required: 'Proficient', weight: 1 },
            databases: { required: 'Proficient', weight: 1 },
            security: { required: 'Developing', weight: 1 },
        },
    },
    'Lead Engineer': {
        softSkills: {
            interpersonal: { required: 'Proficient', weight: 1 },
            projectManagement: { required: 'Proficient', weight: 1.5 },
            problemSolving: { required: 'Expert', weight: 1.5 },
            leadership: { required: 'Proficient', weight: 1.5 },
        },
        hardSkills: {
            coding: { required: 'Expert', weight: 1.5 },
            systemDesign: { required: 'Expert', weight: 1.5 },
            devops: { required: 'Proficient', weight: 1 },
            testing: { required: 'Proficient', weight: 1 },
            databases: { required: 'Proficient', weight: 1 },
            security: { required: 'Proficient', weight: 1 },
        },
    },
    'Associate Principal Engineer': {
        softSkills: {
            interpersonal: { required: 'Expert', weight: 1 },
            projectManagement: { required: 'Expert', weight: 1.5 },
            problemSolving: { required: 'Expert', weight: 1.5 },
            leadership: { required: 'Proficient', weight: 1.5 },
        },
        hardSkills: {
            coding: { required: 'Expert', weight: 1.5 },
            systemDesign: { required: 'Expert', weight: 2 },
            devops: { required: 'Proficient', weight: 1 },
            testing: { required: 'Expert', weight: 1 },
            databases: { required: 'Expert', weight: 1 },
            security: { required: 'Proficient', weight: 1 },
        },
    },
    'Engineering Manager': {
        softSkills: {
            interpersonal: { required: 'Expert', weight: 1.5 },
            projectManagement: { required: 'Expert', weight: 2 },
            problemSolving: { required: 'Proficient', weight: 1 },
            leadership: { required: 'Expert', weight: 2 },
        },
        hardSkills: {
            coding: { required: 'Proficient', weight: 1 },
            systemDesign: { required: 'Proficient', weight: 1.5 },
            devops: { required: 'Proficient', weight: 1 },
            testing: { required: 'Proficient', weight: 1 },
            databases: { required: 'Proficient', weight: 1 },
            security: { required: 'Proficient', weight: 1 },
        },
    },
    'Principal Engineer': {
        softSkills: {
            interpersonal: { required: 'Expert', weight: 1 },
            projectManagement: { required: 'Expert', weight: 1 },
            problemSolving: { required: 'Expert', weight: 2 },
            leadership: { required: 'Expert', weight: 1.5 },
        },
        hardSkills: {
            coding: { required: 'Expert', weight: 1.5 },
            systemDesign: { required: 'Expert', weight: 2 },
            devops: { required: 'Expert', weight: 1.5 },
            testing: { required: 'Expert', weight: 1 },
            databases: { required: 'Expert', weight: 1.5 },
            security: { required: 'Expert', weight: 1.5 },
        },
    },
    'Engineering Division Head': {
        softSkills: {
            interpersonal: { required: 'Expert', weight: 2 },
            projectManagement: { required: 'Expert', weight: 2 },
            problemSolving: { required: 'Expert', weight: 1.5 },
            leadership: { required: 'Expert', weight: 2 },
        },
        hardSkills: {
            coding: { required: 'Proficient', weight: 0.5 },
            systemDesign: { required: 'Expert', weight: 2 },
            devops: { required: 'Proficient', weight: 1 },
            testing: { required: 'Proficient', weight: 0.5 },
            databases: { required: 'Proficient', weight: 1 },
            security: { required: 'Proficient', weight: 1.5 },
        },
    },
};

// Get all soft skills
export const SOFT_SKILLS: SoftSkill[] = [
    'interpersonal',
    'projectManagement',
    'problemSolving',
    'leadership',
];

// Get all hard skills
export const HARD_SKILLS: HardSkill[] = [
    'coding',
    'systemDesign',
    'devops',
    'testing',
    'databases',
    'security',
];
