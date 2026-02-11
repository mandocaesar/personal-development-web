import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Helper to map Prisma CareerGrade enum to display string
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

// Helper to map Prisma Role enum to display role
const ROLE_DISPLAY: Record<string, string> = {
  ADMIN: 'manager',
  MANAGER: 'manager',
  LEAD: 'lead',
  MID: 'mid',
  JUNIOR: 'junior',
  VIEWER: 'junior',
};

// GET /api/team-members - Get team members that the current user manages
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeManager = searchParams.get('includeManager') === 'true';

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all users that are in any team the current user manages
    // Or if ADMIN/MANAGER, get all non-admin users
    let users;
    if (['ADMIN', 'MANAGER'].includes(currentUser.role)) {
      users = await prisma.user.findMany({
        where: includeManager ? {} : {
          role: { notIn: ['ADMIN'] }
        },
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
        orderBy: { name: 'asc' },
      });
    } else if (currentUser.role === 'LEAD') {
      // Leads see their team members  
      const managedMembers = await prisma.teamMember.findMany({
        where: { managerId: currentUser.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              currentGrade: true,
              targetGrade: true,
              avatarInitials: true,
              joinedAt: true,
            }
          }
        }
      });
      users = managedMembers.map(m => m.user);
    } else {
      // Regular users only see themselves
      users = [currentUser].map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        currentGrade: u.currentGrade,
        targetGrade: u.targetGrade,
        avatarInitials: u.avatarInitials,
        joinedAt: u.joinedAt,
      }));
    }

    // Map to the format expected by the frontend
    const members = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: ROLE_DISPLAY[user.role] || 'junior',
      currentGrade: user.currentGrade ? GRADE_DISPLAY[user.currentGrade] || user.currentGrade : 'Associate Engineer',
      targetGrade: user.targetGrade ? GRADE_DISPLAY[user.targetGrade] || user.targetGrade : 'Engineer',
      avatarInitials: user.avatarInitials || user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      joinedAt: user.joinedAt instanceof Date ? user.joinedAt.toISOString().split('T')[0] : String(user.joinedAt),
      dbRole: user.role, // Keep the DB role for filtering
    }));

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}
