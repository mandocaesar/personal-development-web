import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/self-assessments - Get current user's self-assessment (latest)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;

    const selfAssessment = await prisma.selfAssessment.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    if (!selfAssessment) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      ...selfAssessment,
      skills: JSON.parse(selfAssessment.skillsJson),
    });
  } catch (error) {
    console.error('Error fetching self-assessment:', error);
    return NextResponse.json({ error: 'Failed to fetch self-assessment' }, { status: 500 });
  }
}

// POST /api/self-assessments - Create or update self-assessment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { grade, skills } = body;

    if (!grade || !skills) {
      return NextResponse.json({ error: 'grade and skills are required' }, { status: 400 });
    }

    const skillsJson = typeof skills === 'string' ? skills : JSON.stringify(skills);

    // Upsert: find latest and update, or create new
    const existing = await prisma.selfAssessment.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    });

    let selfAssessment;
    if (existing) {
      selfAssessment = await prisma.selfAssessment.update({
        where: { id: existing.id },
        data: { grade, skillsJson },
      });
    } else {
      selfAssessment = await prisma.selfAssessment.create({
        data: {
          userId: session.user.id,
          grade,
          skillsJson,
        },
      });
    }

    return NextResponse.json({
      ...selfAssessment,
      skills: JSON.parse(selfAssessment.skillsJson),
    }, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error('Error saving self-assessment:', error);
    return NextResponse.json({ error: 'Failed to save self-assessment' }, { status: 500 });
  }
}
