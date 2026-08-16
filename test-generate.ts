import prisma from './lib/prisma';

// We will mock the Next.js Request object to test the POST function directly
import { POST } from './app/api/destinations/generate/route';
// if available, or just mock headers

async function createMockRequest(ip: string, userId: string, body: unknown) {
  return new Request('http://localhost/api/destinations/generate', {
    method: 'POST',
    headers: {
      'x-forwarded-for': ip,
      'x-user-id': userId,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

async function main() {
  console.log("=== Running Phase 3 Tests ===");

  // 1. Existing cached destination (Goa)
  console.log("\n1. Testing existing destination (Goa)...");
  const req1 = await createMockRequest('127.0.0.1', 'user-test', { destinationName: 'Goa' });
  const res1 = await POST(req1);
  console.log("Response:", await res1.json());

  // 6. Duplicate simultaneous requests
  console.log("\n6. Testing concurrent requests (Munnar)...");
  // Change IP to avoid rate limit hitting too early
  const req2a = await createMockRequest('127.0.0.2', 'user-test2', { destinationName: 'Munnar' });
  const req2b = await createMockRequest('127.0.0.2', 'user-test2', { destinationName: 'Munnar' });
  
  const [res2a, res2b] = await Promise.all([POST(req2a), POST(req2b)]);
  console.log("Res 1:", await res2a.json());
  console.log("Res 2:", await res2b.json());

  // 10. Verify persistence
  console.log("\n10. Verifying persistence in DB...");
  const munnarDb = await prisma.destination.findUnique({
    where: { id: 'munnar' },
    include: { activities: true, itineraryDays: true, costMultiplier: true }
  });
  if (munnarDb) {
    console.log(`Saved! Name: ${munnarDb.name}, Source: ${munnarDb.source}`);
    console.log(`Activities: ${munnarDb.activities.length} saved`);
    // 8. Verify activities are Google POIs
    console.log("Activities Sample:", munnarDb.activities.map(a => a.name));
    // 9. Verify costs are deterministic
    console.log("Costs Sample:", munnarDb.activities.map(a => a.costPerPerson));
  } else {
    console.log("Failed to save to DB!");
  }

  // 3. Invalid destination
  console.log("\n3. Testing invalid destination...");
  const req3 = await createMockRequest('127.0.0.3', 'user-test3', { destinationName: 'FakePlace123XYZ' });
  const res3 = await POST(req3);
  console.log("Response:", await res3.json(), res3.status);

  // 7. Rate Limiting
  console.log("\n7. Testing rate limit...");
  for (let i = 0; i < 4; i++) {
    const r = await createMockRequest('127.0.0.4', 'user-ratelimit', { destinationName: 'Ooty' });
    const res = await POST(r);
    console.log(`Attempt ${i+1} Status:`, res.status);
  }

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
