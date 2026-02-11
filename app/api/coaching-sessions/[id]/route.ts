import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PATCH /api/coaching-sessions/[id] - Update a coaching session
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes, scheduledAt, duration, topic } = body;

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (scheduledAt) data.scheduledAt = new Date(scheduledAt);
    if (duration) data.duration = duration;
    if (topic) data.topic = topic;

    const updated = await prisma.coachingSession.update({
      where: { id },
      data,
      include: {
        member: {
          select: { id: true, name: true, email: true, avatarInitials: true }
        }
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating coaching session:', error);
    return NextResponse.json({ error: 'Failed to update coaching session' }, { status: 500 });
  }
}

// DELETE /api/coaching-sessions/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.coachingSession.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coaching session:', error);
    return NextResponse.json({ error: 'Failed to delete coaching session' }, { status: 500 });
  }
}
