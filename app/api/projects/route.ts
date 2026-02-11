import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/projects - List projects for current user (or all if admin/manager)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const where: Record<string, unknown> = {};
    
    // If userId param specified and user is admin/manager, filter by that user
    // Otherwise show only current user's projects
    if (userId) {
      where.userId = userId;
    } else {
      const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (currentUser && ['ADMIN', 'MANAGER'].includes(currentUser.role)) {
        // Admin/Manager can see all projects
      } else {
        where.userId = session.user.id;
      }
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, explanation, startDate, endDate, techStack, teamSize, role, jiraLink, confluenceLink, skillsClaimed } = body;

    if (!title || !explanation || !startDate || !teamSize || !role) {
      return NextResponse.json({ error: 'title, explanation, startDate, teamSize, and role are required' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        title,
        explanation,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        techStack: Array.isArray(techStack) ? techStack : (techStack || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        teamSize: parseInt(teamSize),
        role,
        jiraLink: jiraLink || null,
        confluenceLink: confluenceLink || null,
        skillsClaimed: skillsClaimed || [],
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
