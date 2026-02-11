# Skill Gap Analysis & Tracker - Implementation Plan

## Overview
Build a **Next.js** web application for skill assessment and tracking, deployable on **Vercel**. Based on the SWEG-HR Engineering Competencies framework (8 career grades, 4 competency areas). Features user management, project-based skill claims, and learning guidelines.

---

## Competency Framework (from PDF)

### Career Grades
1. Associate Engineer → 2. Engineer → 3. Senior Engineer → 4. Lead Engineer → 5. Associate Principal Engineer → 6. Engineering Manager → 7. Principal Engineer → 8. Engineering Division Head

### Soft Skills (from PDF)
1. **Interpersonal Skills** - Communication, collaboration
2. **Project Management** - Planning, estimation, delivery
3. **Problem Solving & Decision Making** - Technical debugging, RCA
4. **Leadership** - Mentorship, ownership, culture

### Hard Skills (Software Engineering)
1. **Coding & Programming** - Language proficiency, clean code, code review
2. **System Design & Architecture** - HLD/LLD, scalability, microservices, APIs
3. **DevOps & Infrastructure** - CI/CD, containers, cloud (AWS/GCP/Azure), monitoring
4. **Testing & Quality** - Unit/integration/E2E testing, TDD, debugging
5. **Data & Databases** - SQL/NoSQL, data modeling, query optimization
6. **Security** - Auth, encryption, OWASP, secure coding practices

---

## Skill Configuration System

All skills are **configurable per career level** via JSON configuration:

```typescript
// Example: lib/config/skill-requirements.ts
export const skillRequirements = {
  "Associate Engineer": {
    softSkills: {
      interpersonal: { required: "Developing", weight: 1 },
      projectManagement: { required: "Not Yet", weight: 0.5 },
      problemSolving: { required: "Not Yet", weight: 0.5 },
      leadership: { required: "Not Yet", weight: 0.5 }
    },
    hardSkills: {
      coding: { required: "Developing", weight: 1.5 },
      systemDesign: { required: "Not Yet", weight: 0.5 },
      devops: { required: "Not Yet", weight: 0.5 },
      testing: { required: "Developing", weight: 1 },
      databases: { required: "Not Yet", weight: 0.5 },
      security: { required: "Not Yet", weight: 0.5 }
    }
  },
  "Senior Engineer": {
    softSkills: {
      interpersonal: { required: "Proficient", weight: 1 },
      projectManagement: { required: "Proficient", weight: 1 },
      problemSolving: { required: "Proficient", weight: 1.5 },
      leadership: { required: "Developing", weight: 1 }
    },
    hardSkills: {
      coding: { required: "Expert", weight: 1.5 },
      systemDesign: { required: "Proficient", weight: 1.5 },
      devops: { required: "Proficient", weight: 1 },
      testing: { required: "Proficient", weight: 1 },
      databases: { required: "Proficient", weight: 1 },
      security: { required: "Developing", weight: 1 }
    }
  }
  // ... all 8 levels configured
};
```

### Proficiency Levels (4-point scale)
| Level      | Score | Description                     |
| ---------- | ----- | ------------------------------- |
| Not Yet    | 0     | No experience                   |
| Developing | 1     | Learning, needs guidance        |
| Proficient | 2     | Independent, meets expectations |
| Expert     | 3     | Mastery, can teach others       |

---

## Proposed Changes

```
skill-tracker/
├── app/
│   ├── layout.tsx              [NEW] - Root layout with dark theme
│   ├── page.tsx                [NEW] - Home/dashboard
│   ├── assessment/page.tsx     [NEW] - Self-assessment form
│   ├── results/page.tsx        [NEW] - Progression grading view
│   ├── learning/page.tsx       [NEW] - Learning guidelines
│   ├── projects/page.tsx       [NEW] - Project showcase list
│   ├── projects/new/page.tsx   [NEW] - Submit new project
│   ├── users/page.tsx          [NEW] - User management (admin)
│   ├── admin/page.tsx          [NEW] - Skill config admin UI
│   └── globals.css             [NEW] - Premium dark styling
├── components/
│   ├── AssessmentForm.tsx      [NEW] - Self-assessment questionnaire
│   ├── ProgressChart.tsx       [NEW] - Career progression visualization
│   ├── GapAnalysis.tsx         [NEW] - Skill gap breakdown
│   ├── LearningPath.tsx        [NEW] - Learning recommendations
│   ├── ProjectCard.tsx         [NEW] - Project showcase card
│   ├── ProjectForm.tsx         [NEW] - Project submission form
│   ├── UserList.tsx            [NEW] - User management list
│   └── SkillConfigEditor.tsx   [NEW] - Admin config editor
├── lib/
│   ├── config/skill-requirements.ts [NEW] - Per-level skill config
│   ├── types.ts                [NEW] - TypeScript interfaces
│   ├── competencies.ts         [NEW] - Competency data model
│   ├── grading.ts              [NEW] - Progression calculation
│   └── learning.ts             [NEW] - Learning recommendation engine
├── app/api/
│   ├── users/route.ts          [NEW] - User CRUD
│   ├── projects/route.ts       [NEW] - Project CRUD
│   ├── assessment/route.ts     [NEW] - Save/load assessments
│   ├── config/route.ts         [NEW] - Get/update skill config
│   └── recommendations/route.ts [NEW] - Generate learning paths
├── package.json, tailwind.config.ts, vercel.json
```

---

## Key Features

### 1. User Management (`/users`)
- Add/edit/remove participants
- Assign current career grade
- View individual progress dashboards

### 2. Self Assessment (`/assessment`)
- Select current career grade
- Rate each competency (Not Yet / Developing / Proficient / Expert)
- Auto-save to localStorage + API sync

### 3. Project Showcase (`/projects`)
Claim skills by submitting project evidence:

| Field          | Description                            |
| -------------- | -------------------------------------- |
| Title          | Project name                           |
| Explanation    | What you did, your contribution        |
| Duration       | Start/end dates or duration            |
| Tech Stack     | Technologies used                      |
| Team Size      | Number of team members                 |
| Role           | Your role in the project               |
| Links          | JIRA and/or Confluence URLs            |
| Skills Claimed | Which skills this project demonstrates |

### 4. Career Progression Grading (`/results`)
- % readiness for next level
- Gap analysis highlighting missing competencies
- Visual progress chart per competency area

### 5. Learning Guidelines (`/learning`)
- Priority-ranked recommendations
- Actionable items for each gap
- Progress tracking for learning goals

---

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with dark mode
- **State**: localStorage + React Context
- **Backend**: Next.js API Routes (future DB ready)
- **Deployment**: Vercel

---

## Verification Plan

### Automated
- `npm run build` - Verify production build succeeds
- `npm run lint` - Check for code issues

### Manual Browser Testing
1. Test assessment flow - select grade, rate competencies, verify save
2. Test results page - verify progression calculation
3. Test learning page - verify recommendations match gaps
4. Test mobile responsiveness
