import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@email.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@email.com',
      password,
    },
  });
}

main()
  .then(() => console.log('Seed executado'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
