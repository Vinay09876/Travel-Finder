import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const goa = await prisma.destination.findUnique({
    where: { id: 'goa' },
    include: { activities: true }
  });
  console.log(goa.activities.map(a => a.name));
  await prisma.$disconnect();
}
run();
