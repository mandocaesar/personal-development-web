import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/coaching-sessions - List sessions (optionally filter by memberId)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    const where: Record<string, unknown> = {};
    if (memberId) where.memberId = memberId;

    const sessions = await prisma.coachingSession.findMany({
      where,
      include: {
        member: {
          select: { id: true, name: true, email: true, avatarInitials: true }
        }
      },
      orderBy: { scheduledAt: 'desc' },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching coaching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch coaching sessions' }, { status: 500 });
  }
}

// POST /api/coaching-sessions - Create a new coaching session
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { memberId, scheduledAt, duration, topic, notes } = body;

    if (!memberId || !scheduledAt || !topic) {
      return NextResponse.json({ error: 'memberId, scheduledAt, and topic are required' }, { status: 400 });
    }

    const coachingSession = await prisma.coachingSession.create({
      data: {
        memberId,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 30,
        topic,
        notes: notes || '',
      },
      include: {
        member: {
          select: { id: true, name: true, email: true, avatarInitials: true }
        }
      }
    });

    return NextResponse.json(coachingSession, { status: 201 });
  } catch (error) {
    console.error('Error creating coaching session:', error);
    return NextResponse.json({ error: 'Failed to create coaching session' }, { status: 500 });
  }
}
