const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('Checking admin accounts...');
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true
      }
    });
    
    console.log('Admin accounts found:', admins);
    
    console.log('\nChecking citizens...');
    const citizens = await prisma.citizen.findMany({
      select: {
        id: true,
        nid: true,
        firstName: true,
        lastName: true,
        contact: true
      },
      take: 5
    });
    
    console.log('Citizens found:', citizens);
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
