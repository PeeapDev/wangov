import { PrismaClient, AdminRole, Gender, OrgType, AuthType } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed script...');
  
  // Create superadmin
  const superadminPassword = await bcrypt.hash('password123', 10);
  const superadmin = await prisma.admin.upsert({
    where: { username: 'superadmin' },
    update: {
      email: 'superadmin@wangov.sl',
      password: superadminPassword,
    },
    create: {
      username: 'superadmin',
      email: 'superadmin@wangov.sl',
      password: superadminPassword,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    }
  });
  console.log('Superadmin created:', { id: superadmin.id, username: superadmin.username });
  
  // Create admin
  const adminPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {
      email: 'admin@wangov.sl',
      password: adminPassword,
    },
    create: {
      username: 'admin',
      email: 'admin@wangov.sl',
      password: adminPassword,
      role: AdminRole.SYSTEM_ADMIN, // This will map to admin in frontend
      isActive: true,
    }
  });
  console.log('Admin created:', { id: admin.id, username: admin.username });

  // Create organization
  const apiKey = crypto.randomBytes(16).toString('hex');
  const apiSecret = crypto.randomBytes(32).toString('hex');
  
  const organization = await prisma.organization.upsert({
    where: { apiKey },
    update: {},
    create: {
      name: 'Central Hospital',
      type: OrgType.HEALTHCARE,
      apiKey,
      apiSecret,
      callbackUrl: 'https://central-hospital.gov.sl/api/callback',
      accessScope: ['basic_id', 'contact_info'],
      isActive: true
    }
  });
  console.log('Organization created:', { id: organization.id, name: organization.name });

  // Create organization admin (for organization login)
  const orgAdminPassword = await bcrypt.hash('password123', 10);
  const orgAdmin = await prisma.admin.upsert({
    where: { username: 'organization' },
    update: {
      email: 'organization@example.com',
      password: orgAdminPassword,
    },
    create: {
      username: 'organization',
      email: 'organization@example.com',
      password: orgAdminPassword,
      role: AdminRole.ENROLLMENT_ADMIN, // This will map to organization role in frontend
      isActive: true,
    }
  });
  console.log('Organization created:', { id: orgAdmin.id, username: orgAdmin.username });

  // Create organization staff
  const orgStaffPassword = await bcrypt.hash('password123', 10);
  const orgStaff = await prisma.admin.upsert({
    where: { username: 'orgstaff' },
    update: {
      email: 'orgstaff@example.com',
      password: orgStaffPassword,
    },
    create: {
      username: 'orgstaff',
      email: 'orgstaff@example.com',
      password: orgStaffPassword,
      role: AdminRole.SUPPORT_ADMIN, // This will map to organization-staff role in frontend
      isActive: true,
    }
  });
  console.log('Organization Staff created:', { id: orgStaff.id, username: orgStaff.username });
  
  // Create citizen
  const citizenPassword = await bcrypt.hash('password123', 10);
  const nid = `SL${Math.floor(100000000000 + Math.random() * 900000000000)}`;
  
  const citizen = await prisma.citizen.create({
    data: {
      nid,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      gender: Gender.MALE,
      contact: {
        email: 'citizen@example.com',
        phone: '+23279123456',
        address: '123 Main St, Freetown'
      },
      credentials: {
        create: {
          password: citizenPassword
        }
      },
      authMethods: {
        create: [
          {
            type: AuthType.EMAIL,
            value: 'citizen@example.com',
            isPrimary: true,
            isVerified: true,
            verifiedAt: new Date()
          },
          {
            type: AuthType.PHONE,
            value: '+23279123456',
            isVerified: true,
            verifiedAt: new Date()
          }
        ]
      }
    }
  });
  console.log('Citizen created:', { id: citizen.id, nid: citizen.nid });
  
  // Create organization service
  const service = await prisma.service.create({
    data: {
      name: 'Patient Records',
      description: 'Access to patient records for healthcare purposes',
      organizationId: organization.id,
      requiredScopes: ['basic_id', 'contact_info'],
      isActive: true
    }
  });
  console.log('Organization service created:', { id: service.id, name: service.name });

  console.log('Seed script completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
