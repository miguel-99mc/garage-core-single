import { PrismaClient } from '../../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { roles } from '../data/roles';
import { users } from '../data/users';

dotenv.config();

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function seedRoles() {
  const added = [];

  for (const role of roles) {
    // Search key
    const foundKey = await prisma.userRole.findUnique({
      where: {
        key: role.key,
      },
    });

    if (foundKey) {
      continue;
    }

    // Search name
    const foundName = await prisma.userRole.findUnique({
      where: {
        name: role.name,
      },
    });

    if (foundName) {
      continue;
    }

    const roleData = await prisma.userRole.create({
      data: role,
    });

    added.push(roleData);
  }

  console.log(`✅ Seeded ${added.length} roles`);

  return added;
}

async function seedUsers(roles: any[]) {
  const defaultPassword = process.env.DEFAULT_PASSWORD_USER_SEED;

  if (!defaultPassword) {
    console.error('A default password must be provided');
    return;
  }

  const added = [];

  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  for (const user of users) {
    // Search email
    const foundEmail = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (foundEmail) {
      continue;
    }

    const { roles: userRoles, ...dataToAdd } = user;

    const userRolesToAdd = roles?.filter((r) => userRoles.includes(r.name));

    const userData = await prisma.user.create({
      data: {
        ...dataToAdd,
        password: passwordHash,
        userRoles: {
          connect: userRolesToAdd.map((r) => ({
            id: r.id,
          })),
        },
      },
    });

    added.push(userData);
  }

  console.log(`✅ Seeded ${users.length} users`);
}

async function main() {
  console.log('Starting seed...');

  const roles = await seedRoles();
  await seedUsers(roles);

  console.log('✅ Seeded completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
