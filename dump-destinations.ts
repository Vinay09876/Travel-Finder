import prisma from './lib/prisma';

async function main() {
  const dests = await prisma.destination.findMany({ select: { id: true, name: true, state: true } });
  console.log(JSON.stringify(dests, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
