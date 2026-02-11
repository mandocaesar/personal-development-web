import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { hash } from 'bcryptjs';

// Parse DATABASE_URL or use explicit config
const dbUrl = process.env.DATABASE_URL || 'postgresql://devuser:devpassword@localhost:5432/personal_dev_db';
const url = new URL(dbUrl);

// Create a connection pool for PostgreSQL
const pool = new pg.Pool({
  host: url.hostname,
  port: parseInt(url.port || '5432'),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1).split('?')[0],
});

// Create PrismaClient with the PostgreSQL adapter
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      currentGrade: 'ENGINEERING_MANAGER',
      targetGrade: 'ENGINEERING_DIVISION_HEAD',
      avatarInitials: 'AU',
    },
  });
  console.log('✅ Created admin user');

  // Create manager
  const managerPassword = await hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@company.com' },
    update: {},
    create: {
      email: 'manager@company.com',
      name: 'Sarah Manager',
      password: managerPassword,
      role: 'MANAGER',
      currentGrade: 'ENGINEERING_MANAGER',
      targetGrade: 'ENGINEERING_DIVISION_HEAD',
      avatarInitials: 'SM',
    },
  });
  console.log('✅ Created manager user');

  // Create team leads
  const defaultPassword = await hash('password123', 10);
  
  const alice = await prisma.user.upsert({
    where: { email: 'alice@company.com' },
    update: {},
    create: {
      email: 'alice@company.com',
      name: 'Alice Chen',
      password: defaultPassword,
      role: 'LEAD',
      currentGrade: 'LEAD_ENGINEER',
      targetGrade: 'ASSOCIATE_PRINCIPAL_ENGINEER',
      avatarInitials: 'AC',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@company.com' },
    update: {},
    create: {
      email: 'bob@company.com',
      name: 'Bob Martinez',
      password: defaultPassword,
      role: 'LEAD',
      currentGrade: 'LEAD_ENGINEER',
      targetGrade: 'ASSOCIATE_PRINCIPAL_ENGINEER',
      avatarInitials: 'BM',
    },
  });
  console.log('✅ Created team leads');

  // Create mid-level engineers
  const carol = await prisma.user.upsert({
    where: { email: 'carol@company.com' },
    update: {},
    create: {
      email: 'carol@company.com',
      name: 'Carol Wu',
      password: defaultPassword,
      role: 'MID',
      currentGrade: 'SENIOR_ENGINEER',
      targetGrade: 'LEAD_ENGINEER',
      avatarInitials: 'CW',
    },
  });

  const david = await prisma.user.upsert({
    where: { email: 'david@company.com' },
    update: {},
    create: {
      email: 'david@company.com',
      name: 'David Kim',
      password: defaultPassword,
      role: 'MID',
      currentGrade: 'SENIOR_ENGINEER',
      targetGrade: 'LEAD_ENGINEER',
      avatarInitials: 'DK',
    },
  });

  const emma = await prisma.user.upsert({
    where: { email: 'emma@company.com' },
    update: {},
    create: {
      email: 'emma@company.com',
      name: 'Emma Johnson',
      password: defaultPassword,
      role: 'MID',
      currentGrade: 'SENIOR_ENGINEER',
      targetGrade: 'LEAD_ENGINEER',
      avatarInitials: 'EJ',
    },
  });

  const frank = await prisma.user.upsert({
    where: { email: 'frank@company.com' },
    update: {},
    create: {
      email: 'frank@company.com',
      name: 'Frank Lee',
      password: defaultPassword,
      role: 'MID',
      currentGrade: 'ENGINEER',
      targetGrade: 'SENIOR_ENGINEER',
      avatarInitials: 'FL',
    },
  });

  const grace = await prisma.user.upsert({
    where: { email: 'grace@company.com' },
    update: {},
    create: {
      email: 'grace@company.com',
      name: 'Grace Park',
      password: defaultPassword,
      role: 'MID',
      currentGrade: 'ENGINEER',
      targetGrade: 'SENIOR_ENGINEER',
      avatarInitials: 'GP',
    },
  });

  const henry = await prisma.user.upsert({
    where: { email: 'henry@company.com' },
    update: {},
    create: {
      email: 'henry@company.com',
      name: 'Henry Zhang',
      password: defaultPassword,
      role: 'MID',
      currentGrade: 'ENGINEER',
      targetGrade: 'SENIOR_ENGINEER',
      avatarInitials: 'HZ',
    },
  });

  const ivy = await prisma.user.upsert({
    where: { email: 'ivy@company.com' },
    update: {},
    create: {
      email: 'ivy@company.com',
      name: 'Ivy Patel',
      password: defaultPassword,
      role: 'MID',
      currentGrade: 'SENIOR_ENGINEER',
      targetGrade: 'LEAD_ENGINEER',
      avatarInitials: 'IP',
    },
  });

  const jack = await prisma.user.upsert({
    where: { email: 'jack@company.com' },
    update: {},
    create: {
      email: 'jack@company.com',
      name: 'Jack Thompson',
      password: defaultPassword,
      role: 'MID',
      currentGrade: 'ENGINEER',
      targetGrade: 'SENIOR_ENGINEER',
      avatarInitials: 'JT',
    },
  });
  console.log('✅ Created mid-level engineers');

  // Create junior engineers
  const juniorData = [
    { email: 'karen@company.com', name: 'Karen Liu', initials: 'KL' },
    { email: 'leo@company.com', name: 'Leo Garcia', initials: 'LG' },
    { email: 'mia@company.com', name: 'Mia Wilson', initials: 'MW' },
    { email: 'noah@company.com', name: 'Noah Brown', initials: 'NB' },
    { email: 'olivia@company.com', name: 'Olivia Davis', initials: 'OD' },
    { email: 'peter@company.com', name: 'Peter Anderson', initials: 'PA' },
    { email: 'quinn@company.com', name: 'Quinn Taylor', initials: 'QT' },
    { email: 'rosa@company.com', name: 'Rosa Hernandez', initials: 'RH' },
    { email: 'sam@company.com', name: 'Sam Miller', initials: 'SM' },
  ];

  const juniors = [];
  for (const jr of juniorData) {
    const user = await prisma.user.upsert({
      where: { email: jr.email },
      update: {},
      create: {
        email: jr.email,
        name: jr.name,
        password: defaultPassword,
        role: 'JUNIOR',
        currentGrade: 'ASSOCIATE_ENGINEER',
        targetGrade: 'ENGINEER',
        avatarInitials: jr.initials,
      },
    });
    juniors.push(user);
  }
  console.log('✅ Created junior engineers');

  // Create teams
  const engineeringTeam = await prisma.team.upsert({
    where: { id: 'team-engineering' },
    update: {},
    create: {
      id: 'team-engineering',
      name: 'Engineering Team',
      description: 'Main engineering team',
    },
  });

  const frontendTeam = await prisma.team.upsert({
    where: { id: 'team-frontend' },
    update: {},
    create: {
      id: 'team-frontend',
      name: 'Frontend Team',
      description: 'Frontend development team',
    },
  });
  console.log('✅ Created teams');

  // Add team members
  await prisma.teamMember.upsert({
    where: {
      userId_teamId: {
        userId: alice.id,
        teamId: engineeringTeam.id,
      },
    },
    update: {},
    create: {
      userId: alice.id,
      teamId: engineeringTeam.id,
      managerId: manager.id,
    },
  });

  await prisma.teamMember.upsert({
    where: {
      userId_teamId: {
        userId: bob.id,
        teamId: frontendTeam.id,
      },
    },
    update: {},
    create: {
      userId: bob.id,
      teamId: frontendTeam.id,
      managerId: manager.id,
    },
  });

  await prisma.teamMember.upsert({
    where: {
      userId_teamId: {
        userId: carol.id,
        teamId: engineeringTeam.id,
      },
    },
    update: {},
    create: {
      userId: carol.id,
      teamId: engineeringTeam.id,
      managerId: alice.id,
    },
  });

  await prisma.teamMember.upsert({
    where: {
      userId_teamId: {
        userId: david.id,
        teamId: frontendTeam.id,
      },
    },
    update: {},
    create: {
      userId: david.id,
      teamId: frontendTeam.id,
      managerId: bob.id,
    },
  });

  await prisma.teamMember.upsert({
    where: {
      userId_teamId: {
        userId: emma.id,
        teamId: engineeringTeam.id,
      },
    },
    update: {},
    create: {
      userId: emma.id,
      teamId: engineeringTeam.id,
      managerId: alice.id,
    },
  });

  // Add remaining mid engineers to teams
  const midTeamAssignments = [
    { user: frank, team: frontendTeam, mgr: bob },
    { user: grace, team: engineeringTeam, mgr: alice },
    { user: henry, team: frontendTeam, mgr: bob },
    { user: ivy, team: engineeringTeam, mgr: alice },
    { user: jack, team: frontendTeam, mgr: bob },
  ];

  for (const assignment of midTeamAssignments) {
    await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: assignment.user.id,
          teamId: assignment.team.id,
        },
      },
      update: {},
      create: {
        userId: assignment.user.id,
        teamId: assignment.team.id,
        managerId: assignment.mgr.id,
      },
    });
  }

  // Add juniors to teams (split between engineering and frontend)
  for (let i = 0; i < juniors.length; i++) {
    const team = i % 2 === 0 ? engineeringTeam : frontendTeam;
    const mgr = i % 2 === 0 ? alice : bob;
    await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: juniors[i].id,
          teamId: team.id,
        },
      },
      update: {},
      create: {
        userId: juniors[i].id,
        teamId: team.id,
        managerId: mgr.id,
      },
    });
  }
  console.log('✅ Added team members');

  // Create sample assessments
  const sampleSkills = JSON.stringify({
    hardSkills: {
      'System Design': { level: 3, notes: 'Strong architecture skills' },
      'Code Quality': { level: 4, notes: 'Excellent code reviews' },
      'Testing': { level: 3, notes: 'Good test coverage' },
    },
    softSkills: {
      'Communication': { level: 4, notes: 'Clear communicator' },
      'Leadership': { level: 3, notes: 'Growing leadership' },
    },
  });

  await prisma.assessment.create({
    data: {
      assesseeId: carol.id,
      assessorId: manager.id,
      grade: 'SENIOR_ENGINEER',
      skillsJson: sampleSkills,
      notes: 'Carol shows strong technical skills and is on track for Lead Engineer.',
      readinessScore: 72,
    },
  });

  await prisma.assessment.create({
    data: {
      assesseeId: david.id,
      assessorId: manager.id,
      grade: 'SENIOR_ENGINEER',
      skillsJson: sampleSkills,
      notes: 'David has great frontend expertise and mentors junior engineers well.',
      readinessScore: 68,
    },
  });
  console.log('✅ Created sample assessments');

  // Create sample coaching sessions
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  await prisma.coachingSession.create({
    data: {
      memberId: carol.id,
      scheduledAt: nextWeek,
      duration: 60,
      topic: 'Career progression to Lead Engineer',
      notes: 'Discuss system design projects and leadership opportunities.',
      status: 'SCHEDULED',
    },
  });

  await prisma.coachingSession.create({
    data: {
      memberId: alice.id,
      scheduledAt: lastWeek,
      duration: 45,
      topic: 'Team performance review',
      notes: 'Reviewed Q1 team metrics. Alice is doing great managing her reports.',
      status: 'COMPLETED',
    },
  });
  console.log('✅ Created sample coaching sessions');

  // Create sample projects
  await prisma.project.create({
    data: {
      userId: carol.id,
      title: 'API Gateway Migration',
      explanation: 'Led the migration from monolithic API to microservices gateway pattern. Implemented rate limiting, authentication middleware, and service discovery.',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-15'),
      techStack: ['Node.js', 'TypeScript', 'Kong', 'Docker', 'Kubernetes'],
      teamSize: 5,
      role: 'Tech Lead',
      skillsClaimed: ['System Design', 'Code Quality', 'DevOps'],
    },
  });

  await prisma.project.create({
    data: {
      userId: david.id,
      title: 'Design System v2',
      explanation: 'Built a comprehensive design system with reusable React components, documentation site, and automated visual regression testing.',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
      techStack: ['React', 'TypeScript', 'Storybook', 'Chromatic', 'TailwindCSS'],
      teamSize: 3,
      role: 'Frontend Lead',
      skillsClaimed: ['Code Quality', 'Testing', 'Communication'],
    },
  });
  console.log('✅ Created sample projects');

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Login credentials:');
  console.log('Admin: admin@company.com / admin123');
  console.log('Manager: manager@company.com / manager123');
  console.log('Others: <email> / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
