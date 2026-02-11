import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const GRADE_DISPLAY: Record<string, string> = {
  ASSOCIATE_ENGINEER: 'Associate Engineer',
  ENGINEER: 'Engineer',
  SENIOR_ENGINEER: 'Senior Engineer',
  LEAD_ENGINEER: 'Lead Engineer',
  ASSOCIATE_PRINCIPAL_ENGINEER: 'Associate Principal Engineer',
  PRINCIPAL_ENGINEER: 'Principal Engineer',
  DISTINGUISHED_ENGINEER: 'Distinguished Engineer',
  ENGINEERING_MANAGER: 'Engineering Manager',
  ENGINEERING_DIVISION_HEAD: 'Engineering Division Head',
};

const ROLE_DISPLAY: Record<string, string> = {
  ADMIN: 'manager',
  MANAGER: 'manager',
  LEAD: 'lead',
  MID: 'mid',
  JUNIOR: 'junior',
  VIEWER: 'junior',
};

// GET /api/team-members/[id] - Get a single team member
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        currentGrade: true,
        targetGrade: true,
        avatarInitials: true,
        joinedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const member = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: ROLE_DISPLAY[user.role] || 'junior',
      currentGrade: user.currentGrade ? GRADE_DISPLAY[user.currentGrade] || user.currentGrade : 'Associate Engineer',
      targetGrade: user.targetGrade ? GRADE_DISPLAY[user.targetGrade] || user.targetGrade : 'Engineer',
      avatarInitials: user.avatarInitials || user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
      joinedAt: user.joinedAt instanceof Date ? user.joinedAt.toISOString().split('T')[0] : String(user.joinedAt),
      dbRole: user.role,
    };

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}
