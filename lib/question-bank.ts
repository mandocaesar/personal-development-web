import { SoftSkill, HardSkill } from './types';

export interface Question {
    id: string;
    skill: SoftSkill | HardSkill;
    level: 'junior' | 'mid' | 'senior' | 'lead';
    type: 'scenario' | 'technical' | 'behavioral' | 'coding';
    question: string;
    context?: string;
    hints?: string[];
    expectedPoints?: string[];
    timeEstimate: number; // minutes
}

// Question bank organized by skill
export const QUESTION_BANK: Question[] = [
    // ===== SOFT SKILLS =====

    // Interpersonal Skills
    {
        id: 'inter-1',
        skill: 'interpersonal',
        level: 'junior',
        type: 'behavioral',
        question: 'Describe a time when you had a disagreement with a teammate. How did you resolve it?',
        expectedPoints: ['Active listening', 'Seeking understanding', 'Finding common ground', 'Professional communication'],
        timeEstimate: 5,
    },
    {
        id: 'inter-2',
        skill: 'interpersonal',
        level: 'mid',
        type: 'scenario',
        question: 'A junior developer on your team is consistently missing code review feedback. How would you approach this situation?',
        context: 'The developer seems frustrated and defensive when receiving feedback.',
        expectedPoints: ['Private 1-on-1 conversation', 'Understanding root cause', 'Providing constructive guidance', 'Follow-up plan'],
        timeEstimate: 5,
    },
    {
        id: 'inter-3',
        skill: 'interpersonal',
        level: 'senior',
        type: 'scenario',
        question: 'Two senior members of your team have conflicting technical opinions that are blocking project progress. How do you facilitate resolution?',
        expectedPoints: ['Neutral mediation', 'Data-driven decision making', 'Documenting trade-offs', 'Building consensus'],
        timeEstimate: 7,
    },

    // Problem Solving
    {
        id: 'prob-1',
        skill: 'problemSolving',
        level: 'junior',
        type: 'technical',
        question: 'Walk me through how you would debug a function that returns incorrect results intermittently.',
        hints: ['Consider race conditions', 'Think about edge cases', 'Logging strategies'],
        expectedPoints: ['Reproduce the issue', 'Add logging', 'Check inputs/outputs', 'Isolate the problem'],
        timeEstimate: 5,
    },
    {
        id: 'prob-2',
        skill: 'problemSolving',
        level: 'mid',
        type: 'scenario',
        question: 'Production is down. Users are reporting 500 errors. You have access to logs, metrics, and the codebase. Walk me through your incident response.',
        context: 'The last deployment was 2 hours ago. The error rate started spiking 30 minutes ago.',
        expectedPoints: ['Check recent changes', 'Review logs/metrics', 'Rollback consideration', 'Communication plan', 'Root cause analysis'],
        timeEstimate: 10,
    },
    {
        id: 'prob-3',
        skill: 'problemSolving',
        level: 'senior',
        type: 'technical',
        question: 'Design a strategy to identify and resolve a memory leak in a long-running Node.js service.',
        expectedPoints: ['Heap snapshots', 'Memory profiling', 'Identifying retention', 'GC analysis', 'Fix verification'],
        timeEstimate: 10,
    },

    // Project Management
    {
        id: 'pm-1',
        skill: 'projectManagement',
        level: 'junior',
        type: 'behavioral',
        question: 'How do you organize and prioritize your daily tasks? Give a specific example.',
        expectedPoints: ['Task tracking method', 'Priority criteria', 'Time blocking', 'Managing interruptions'],
        timeEstimate: 5,
    },
    {
        id: 'pm-2',
        skill: 'projectManagement',
        level: 'mid',
        type: 'scenario',
        question: 'You realize mid-sprint that a feature will take 3x longer than estimated. What do you do?',
        expectedPoints: ['Early communication', 'Scope negotiation', 'Impact assessment', 'Updated timeline', 'Lessons learned'],
        timeEstimate: 5,
    },
    {
        id: 'pm-3',
        skill: 'projectManagement',
        level: 'lead',
        type: 'scenario',
        question: 'Your team is consistently missing sprint commitments. How do you diagnose and address this?',
        expectedPoints: ['Velocity analysis', 'Estimation review', 'Blocker identification', 'Process improvement', 'Team capacity planning'],
        timeEstimate: 7,
    },

    // Leadership
    {
        id: 'lead-1',
        skill: 'leadership',
        level: 'mid',
        type: 'behavioral',
        question: 'Describe a time when you mentored a junior developer. What was your approach?',
        expectedPoints: ['Setting clear goals', 'Regular check-ins', 'Constructive feedback', 'Celebrating progress'],
        timeEstimate: 5,
    },
    {
        id: 'lead-2',
        skill: 'leadership',
        level: 'senior',
        type: 'scenario',
        question: 'A high-performing team member is showing signs of burnout. How do you handle this?',
        expectedPoints: ['Private conversation', 'Understanding workload', 'Adjusting responsibilities', 'Long-term prevention'],
        timeEstimate: 5,
    },
    {
        id: 'lead-3',
        skill: 'leadership',
        level: 'lead',
        type: 'scenario',
        question: 'You need to advocate for adopting a new technology that requires significant investment. How do you build the case?',
        expectedPoints: ['Business value analysis', 'Risk assessment', 'Proof of concept', 'Stakeholder alignment', 'Migration plan'],
        timeEstimate: 7,
    },

    // ===== HARD SKILLS =====

    // Coding & Programming
    {
        id: 'code-1',
        skill: 'coding',
        level: 'junior',
        type: 'coding',
        question: 'Write a function that finds the first duplicate in an array of integers. Explain your approach and time complexity.',
        hints: ['Consider using a Set', 'Think about space vs time trade-offs'],
        expectedPoints: ['Working solution', 'Correct complexity analysis', 'Edge case handling', 'Clean code'],
        timeEstimate: 10,
    },
    {
        id: 'code-2',
        skill: 'coding',
        level: 'mid',
        type: 'coding',
        question: 'Implement a rate limiter class that allows N requests per minute. Show how you would test it.',
        context: 'Consider thread safety and memory efficiency.',
        expectedPoints: ['Sliding window or token bucket', 'Thread safety consideration', 'Test cases', 'Edge cases'],
        timeEstimate: 15,
    },
    {
        id: 'code-3',
        skill: 'coding',
        level: 'senior',
        type: 'coding',
        question: 'Design and implement a pub/sub system with message persistence and at-least-once delivery guarantees.',
        expectedPoints: ['Architecture design', 'Persistence strategy', 'Acknowledgment handling', 'Error recovery', 'Scalability considerations'],
        timeEstimate: 20,
    },

    // System Design
    {
        id: 'sys-1',
        skill: 'systemDesign',
        level: 'mid',
        type: 'technical',
        question: 'Design a URL shortening service like bit.ly. Cover the key components and trade-offs.',
        hints: ['Consider read vs write ratio', 'Think about ID generation'],
        expectedPoints: ['API design', 'Database choice', 'ID generation strategy', 'Caching', 'Analytics'],
        timeEstimate: 15,
    },
    {
        id: 'sys-2',
        skill: 'systemDesign',
        level: 'senior',
        type: 'technical',
        question: 'Design a real-time collaborative document editor like Google Docs.',
        expectedPoints: ['Conflict resolution (CRDT/OT)', 'WebSocket architecture', 'Persistence', 'Presence system', 'Scaling strategy'],
        timeEstimate: 20,
    },
    {
        id: 'sys-3',
        skill: 'systemDesign',
        level: 'lead',
        type: 'technical',
        question: 'Design a multi-region, highly available payment processing system.',
        expectedPoints: ['Consistency guarantees', 'Idempotency', 'Failure modes', 'Compliance considerations', 'Monitoring/alerting'],
        timeEstimate: 25,
    },

    // DevOps & Infrastructure
    {
        id: 'devops-1',
        skill: 'devops',
        level: 'junior',
        type: 'technical',
        question: 'Explain the difference between Docker containers and virtual machines. When would you use each?',
        expectedPoints: ['Resource isolation', 'Performance overhead', 'Use cases', 'Trade-offs'],
        timeEstimate: 5,
    },
    {
        id: 'devops-2',
        skill: 'devops',
        level: 'mid',
        type: 'scenario',
        question: 'Design a CI/CD pipeline for a microservices application with 10+ services.',
        expectedPoints: ['Build stages', 'Testing strategy', 'Deployment strategy', 'Rollback plan', 'Environment management'],
        timeEstimate: 10,
    },
    {
        id: 'devops-3',
        skill: 'devops',
        level: 'senior',
        type: 'technical',
        question: 'How would you implement zero-downtime deployments for a stateful service like a database?',
        expectedPoints: ['Blue-green or canary', 'Data migration strategy', 'Backward compatibility', 'Health checks', 'Rollback procedures'],
        timeEstimate: 10,
    },

    // Testing & Quality
    {
        id: 'test-1',
        skill: 'testing',
        level: 'junior',
        type: 'technical',
        question: 'What is the difference between unit tests, integration tests, and E2E tests? Give examples of when to use each.',
        expectedPoints: ['Scope differences', 'Speed trade-offs', 'Maintenance costs', 'Coverage strategy'],
        timeEstimate: 5,
    },
    {
        id: 'test-2',
        skill: 'testing',
        level: 'mid',
        type: 'scenario',
        question: 'You inherit a codebase with zero tests. How do you prioritize what to test first?',
        expectedPoints: ['Critical path coverage', 'Risk assessment', 'Regression prevention', 'Incremental approach'],
        timeEstimate: 7,
    },
    {
        id: 'test-3',
        skill: 'testing',
        level: 'senior',
        type: 'technical',
        question: 'Design a testing strategy for a payment processing system. Include failure scenarios.',
        expectedPoints: ['Unit/integration/E2E split', 'Mocking external services', 'Chaos engineering', 'Performance testing', 'Compliance testing'],
        timeEstimate: 10,
    },

    // Data & Databases
    {
        id: 'data-1',
        skill: 'databases',
        level: 'junior',
        type: 'technical',
        question: 'Explain database indexes. When would you add an index and when might it hurt performance?',
        expectedPoints: ['How indexes work', 'Query optimization', 'Write performance impact', 'Index selection criteria'],
        timeEstimate: 5,
    },
    {
        id: 'data-2',
        skill: 'databases',
        level: 'mid',
        type: 'coding',
        question: 'Write a SQL query to find the top 3 customers by total order value in the last 30 days, excluding refunded orders.',
        expectedPoints: ['Correct joins', 'Aggregation', 'Date filtering', 'Exclusion logic', 'Performance considerations'],
        timeEstimate: 10,
    },
    {
        id: 'data-3',
        skill: 'databases',
        level: 'senior',
        type: 'technical',
        question: 'Design a data pipeline for processing 1M events per second with exactly-once semantics.',
        expectedPoints: ['Stream processing framework', 'Partitioning strategy', 'Checkpointing', 'Dead letter handling', 'Monitoring'],
        timeEstimate: 15,
    },

    // Security
    {
        id: 'sec-1',
        skill: 'security',
        level: 'junior',
        type: 'technical',
        question: 'What is SQL injection and how do you prevent it? Give a code example.',
        expectedPoints: ['Attack explanation', 'Parameterized queries', 'Input validation', 'Code example'],
        timeEstimate: 5,
    },
    {
        id: 'sec-2',
        skill: 'security',
        level: 'mid',
        type: 'scenario',
        question: 'Review this API endpoint for security vulnerabilities. What issues do you see and how would you fix them?',
        context: 'POST /api/users/:id/update - accepts JSON body with user data, returns updated user object.',
        expectedPoints: ['Authorization checks', 'Input validation', 'Mass assignment', 'Rate limiting', 'Audit logging'],
        timeEstimate: 10,
    },
    {
        id: 'sec-3',
        skill: 'security',
        level: 'senior',
        type: 'technical',
        question: 'Design an authentication and authorization system for a multi-tenant SaaS application.',
        expectedPoints: ['Token strategy (JWT/sessions)', 'RBAC/ABAC', 'Tenant isolation', 'MFA', 'Audit trails'],
        timeEstimate: 15,
    },
];

// Helper to get questions by skill
export function getQuestionsBySkill(skill: SoftSkill | HardSkill): Question[] {
    return QUESTION_BANK.filter(q => q.skill === skill);
}

// Helper to get questions by level
export function getQuestionsByLevel(level: Question['level']): Question[] {
    return QUESTION_BANK.filter(q => q.level === level);
}

// Helper to get random questions for a skill
export function getRandomQuestions(skill: SoftSkill | HardSkill, count: number): Question[] {
    const questions = getQuestionsBySkill(skill);
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
