import prisma from '../lib/prisma';

async function main() {
  await prisma.destination.deleteMany({
    where: { id: 'hyderabad' }
  });
  console.log('Deleted hyderabad from DB');
}

main().catch(console.error).finally(() => prisma.$disconnect());
