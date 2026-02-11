import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/assessments - List assessments (optionally filter by assesseeId)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assesseeId = searchParams.get('assesseeId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};
    if (assesseeId) where.assesseeId = assesseeId;

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        assessee: {
          select: { id: true, name: true, email: true, avatarInitials: true, currentGrade: true, targetGrade: true, role: true }
        },
        assessor: {
          select: { id: true, name: true, email: true, avatarInitials: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

// POST /api/assessments - Create a new assessment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { assesseeId, grade, skillsJson, notes, readinessScore } = body;

    if (!assesseeId || !grade || !skillsJson) {
      return NextResponse.json({ error: 'assesseeId, grade, and skillsJson are required' }, { status: 400 });
    }

    const assessment = await prisma.assessment.create({
      data: {
        assesseeId,
        assessorId: session.user.id,
        grade,
        skillsJson: typeof skillsJson === 'string' ? skillsJson : JSON.stringify(skillsJson),
        notes: notes || '',
        readinessScore: readinessScore || 0,
      },
      include: {
        assessee: {
          select: { id: true, name: true, avatarInitials: true }
        },
        assessor: {
          select: { id: true, name: true, avatarInitials: true }
        }
      }
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}
