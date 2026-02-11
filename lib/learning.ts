import {
    SkillType,
    ProficiencyLevel,
    LearningRecommendation,
    GapAnalysisResult,
    SOFT_SKILL_LABELS,
    HARD_SKILL_LABELS,
    SoftSkill,
} from './types';

// Learning resources and recommendations per skill
const learningResources: Record<SkillType, Record<ProficiencyLevel, string[]>> = {
    // Soft Skills
    interpersonal: {
        'Not Yet': [
            'Practice active listening in team meetings',
            'Seek feedback from peers on communication style',
            'Join cross-team collaboration initiatives',
        ],
        Developing: [
            'Lead small team discussions or presentations',
            'Mentor junior team members informally',
            'Practice giving constructive feedback',
        ],
        Proficient: [
            'Facilitate workshops or knowledge sharing sessions',
            'Resolve conflicts within team settings',
            'Build relationships across departments',
        ],
        Expert: [
            'Coach others on communication skills',
            'Lead organizational culture initiatives',
            'Represent team in cross-org discussions',
        ],
    },
    projectManagement: {
        'Not Yet': [
            'Learn basic project management concepts (Agile/Scrum)',
            'Use task tracking tools effectively (JIRA, Trello)',
            'Understand sprint planning and estimation',
        ],
        Developing: [
            'Lead small feature deliveries end-to-end',
            'Practice story writing and task breakdown',
            'Track and communicate project status regularly',
        ],
        Proficient: [
            'Manage medium-sized projects independently',
            'Handle dependencies and stakeholder communication',
            'Implement process improvements',
        ],
        Expert: [
            'Lead cross-team project coordination',
            'Define project management standards',
            'Coach others on delivery practices',
        ],
    },
    problemSolving: {
        'Not Yet': [
            'Practice structured debugging approaches',
            'Learn root cause analysis techniques',
            'Study common design patterns and solutions',
        ],
        Developing: [
            'Lead technical investigations and RCAs',
            'Document problem-solving approaches',
            'Propose solutions with trade-off analysis',
        ],
        Proficient: [
            'Solve ambiguous problems with multiple stakeholders',
            'Make data-driven technical decisions',
            'Design solutions for complex requirements',
        ],
        Expert: [
            'Define problem-solving frameworks for the org',
            'Lead architectural decision making',
            'Mentor others on analytical thinking',
        ],
    },
    leadership: {
        'Not Yet': [
            'Take ownership of small tasks or features',
            'Help onboard new team members',
            'Participate actively in team discussions',
        ],
        Developing: [
            'Lead small initiatives or improvements',
            'Mentor junior developers',
            'Drive code review culture',
        ],
        Proficient: [
            'Lead project teams and technical directions',
            'Influence technical decisions beyond your team',
            'Develop talent through coaching',
        ],
        Expert: [
            'Shape engineering culture and practices',
            'Lead strategic technical initiatives',
            'Build and develop high-performing teams',
        ],
    },

    // Hard Skills
    coding: {
        'Not Yet': [
            'Complete online coding courses (JavaScript, Python, etc.)',
            'Practice coding problems on LeetCode/HackerRank',
            'Contribute to simple bug fixes',
        ],
        Developing: [
            'Write production code with guidance',
            'Learn and apply clean code principles',
            'Participate actively in code reviews',
        ],
        Proficient: [
            'Implement complex features independently',
            'Lead code quality improvements',
            'Master multiple programming paradigms',
        ],
        Expert: [
            'Define coding standards for the organization',
            'Optimize critical system components',
            'Architect reusable libraries and frameworks',
        ],
    },
    systemDesign: {
        'Not Yet': [
            'Study system design fundamentals (CAP, scaling)',
            'Understand existing system architectures',
            'Learn about microservices vs monoliths',
        ],
        Developing: [
            'Design small services with guidance',
            'Document technical designs (LLD)',
            'Understand API design principles',
        ],
        Proficient: [
            'Design scalable systems independently',
            'Create high-level and low-level designs',
            'Lead design reviews',
        ],
        Expert: [
            'Define architectural standards',
            'Design organization-wide platforms',
            'Lead technical due diligence',
        ],
    },
    devops: {
        'Not Yet': [
            'Learn CI/CD concepts and tools',
            'Understand containerization (Docker basics)',
            'Study cloud fundamentals (AWS/GCP)',
        ],
        Developing: [
            'Configure and maintain CI/CD pipelines',
            'Deploy applications to cloud environments',
            'Monitor applications and respond to alerts',
        ],
        Proficient: [
            'Design deployment strategies',
            'Implement infrastructure as code',
            'Optimize cloud costs and performance',
        ],
        Expert: [
            'Define DevOps practices for the org',
            'Architect multi-region deployments',
            'Lead platform engineering initiatives',
        ],
    },
    testing: {
        'Not Yet': [
            'Learn unit testing fundamentals',
            'Understand test pyramid concepts',
            'Write basic unit tests',
        ],
        Developing: [
            'Write comprehensive unit and integration tests',
            'Understand TDD practices',
            'Debug test failures effectively',
        ],
        Proficient: [
            'Design testing strategies for projects',
            'Implement E2E testing frameworks',
            'Lead quality improvements',
        ],
        Expert: [
            'Define testing standards for the org',
            'Architect automated testing platforms',
            'Coach others on testing best practices',
        ],
    },
    databases: {
        'Not Yet': [
            'Learn SQL fundamentals',
            'Understand RDBMS vs NoSQL',
            'Practice basic query optimization',
        ],
        Developing: [
            'Design database schemas',
            'Write efficient queries',
            'Understand indexing and transactions',
        ],
        Proficient: [
            'Optimize database performance',
            'Design data models for scale',
            'Handle data migrations safely',
        ],
        Expert: [
            'Architect data platforms',
            'Define data governance standards',
            'Lead database technology decisions',
        ],
    },
    security: {
        'Not Yet': [
            'Learn OWASP Top 10 vulnerabilities',
            'Understand authentication concepts',
            'Practice secure coding basics',
        ],
        Developing: [
            'Implement secure authentication flows',
            'Conduct basic security reviews',
            'Handle sensitive data properly',
        ],
        Proficient: [
            'Design secure systems',
            'Lead security audits and fixes',
            'Implement encryption and access controls',
        ],
        Expert: [
            'Define security architecture standards',
            'Lead security incident response',
            'Coach others on secure development',
        ],
    },
};

/**
 * Get learning recommendations for skill gaps
 */
export function generateLearningPath(gaps: GapAnalysisResult[]): LearningRecommendation[] {
    return gaps
        .sort((a, b) => b.gap * b.weight - a.gap * a.weight)
        .map((gap) => {
            const isSoftSkill = gap.category === 'soft';
            const label = isSoftSkill
                ? SOFT_SKILL_LABELS[gap.skill as SoftSkill]
                : HARD_SKILL_LABELS[gap.skill as keyof typeof HARD_SKILL_LABELS];

            // Get recommendations for current level to improve to next
            const resources = learningResources[gap.skill];
            const recommendations = resources[gap.current] || [];

            // Determine priority based on gap size and weight
            let priority: 'high' | 'medium' | 'low' = 'low';
            const score = gap.gap * gap.weight;
            if (score >= 3) priority = 'high';
            else if (score >= 1.5) priority = 'medium';

            return {
                skill: gap.skill,
                skillLabel: label,
                currentLevel: gap.current,
                targetLevel: gap.required,
                priority,
                recommendations,
            };
        });
}
