import {
    CareerGrade,
    SkillAssessment,
    ProgressionResult,
    GapAnalysisResult,
    ProficiencyLevel,
    PROFICIENCY_SCORES,
    CAREER_GRADES,
    SOFT_SKILL_LABELS,
    HARD_SKILL_LABELS,
    SoftSkill,
    HardSkill,
} from './types';
import { skillRequirements, SOFT_SKILLS, HARD_SKILLS } from './config/skill-requirements';

/**
 * Get the next career grade
 */
export function getNextGrade(currentGrade: CareerGrade): CareerGrade | null {
    const currentIndex = CAREER_GRADES.indexOf(currentGrade);
    if (currentIndex === -1 || currentIndex === CAREER_GRADES.length - 1) {
        return null;
    }
    return CAREER_GRADES[currentIndex + 1];
}

/**
 * Calculate gap between current and required proficiency
 */
function calculateGap(current: ProficiencyLevel, required: ProficiencyLevel): number {
    return Math.max(0, PROFICIENCY_SCORES[required] - PROFICIENCY_SCORES[current]);
}

/**
 * Analyze skill gaps for progression to next level
 */
export function analyzeProgression(
    currentGrade: CareerGrade,
    assessment: SkillAssessment
): ProgressionResult | null {
    const targetGrade = getNextGrade(currentGrade);
    if (!targetGrade) {
        return null;
    }

    const targetRequirements = skillRequirements[targetGrade];
    const gaps: GapAnalysisResult[] = [];
    const strengths: GapAnalysisResult[] = [];

    // Analyze soft skills
    for (const skill of SOFT_SKILLS) {
        const current = assessment.softSkills[skill];
        const required = targetRequirements.softSkills[skill].required;
        const weight = targetRequirements.softSkills[skill].weight;
        const gap = calculateGap(current, required);

        const result: GapAnalysisResult = {
            skill,
            skillLabel: SOFT_SKILL_LABELS[skill],
            category: 'soft',
            current,
            required,
            gap,
            weight,
        };

        if (gap > 0) {
            gaps.push(result);
        } else {
            strengths.push(result);
        }
    }

    // Analyze hard skills
    for (const skill of HARD_SKILLS) {
        const current = assessment.hardSkills[skill];
        const required = targetRequirements.hardSkills[skill].required;
        const weight = targetRequirements.hardSkills[skill].weight;
        const gap = calculateGap(current, required);

        const result: GapAnalysisResult = {
            skill,
            skillLabel: HARD_SKILL_LABELS[skill],
            category: 'hard',
            current,
            required,
            gap,
            weight,
        };

        if (gap > 0) {
            gaps.push(result);
        } else {
            strengths.push(result);
        }
    }

    // Calculate readiness percentage
    const totalWeight = [...gaps, ...strengths].reduce((sum, g) => sum + g.weight, 0);
    const achievedWeight = strengths.reduce((sum, s) => sum + s.weight, 0);
    const partialWeight = gaps.reduce((sum, g) => {
        const currentScore = PROFICIENCY_SCORES[g.current];
        const requiredScore = PROFICIENCY_SCORES[g.required];
        if (requiredScore === 0) return sum + g.weight;
        const progress = currentScore / requiredScore;
        return sum + g.weight * progress;
    }, 0);

    const readinessPercentage = Math.round(
        ((achievedWeight + partialWeight) / totalWeight) * 100
    );

    // Sort gaps by weighted importance (gap * weight)
    gaps.sort((a, b) => b.gap * b.weight - a.gap * a.weight);

    return {
        currentGrade,
        targetGrade,
        readinessPercentage,
        gaps,
        strengths,
    };
}

/**
 * Create an empty assessment with all skills set to "Not Yet"
 */
export function createEmptyAssessment(): SkillAssessment {
    const softSkills = {} as Record<SoftSkill, ProficiencyLevel>;
    const hardSkills = {} as Record<HardSkill, ProficiencyLevel>;

    for (const skill of SOFT_SKILLS) {
        softSkills[skill] = 'Not Yet';
    }
    for (const skill of HARD_SKILLS) {
        hardSkills[skill] = 'Not Yet';
    }

    return { softSkills, hardSkills };
}

/**
 * Get requirements for a specific grade
 */
export function getGradeRequirements(grade: CareerGrade) {
    return skillRequirements[grade];
}
