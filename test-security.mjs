import crypto from 'crypto';

async function requestAiItinerary(payload, headers) {
  const res = await fetch('http://localhost:3000/api/ai-itinerary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(payload)
  });
  return res;
}

const validPayload = {
  destinationId: 'dest-goa-1',
  query: {
    fromCity: 'Mumbai',
    budget: 50000,
    travelers: 2,
    durationDays: 3,
    month: 'January',
  },
  preferences: {
    vibe: 'relaxed',
    startTime: 'leisure',
    dietary: 'all'
  }
};

async function testLimits() {
  console.log('Testing limits...');
  
  // 1. Invalid UUID
  console.log('\n--- 1. Invalid UUID ---');
  let res = await requestAiItinerary(validPayload, { 'x-user-id': 'invalid-uuid' });
  console.log('Status (Expect 400):', res.status);
  
  // 2. Duration = 100
  console.log('\n--- 2. Huge Duration ---');
  let badPayload = JSON.parse(JSON.stringify(validPayload));
  badPayload.query.durationDays = 100;
  res = await requestAiItinerary(badPayload, { 'x-user-id': crypto.randomUUID() });
  console.log('Status (Expect 400):', res.status);
  
  // 3. Travelers = -1
  console.log('\n--- 3. Negative Travelers ---');
  badPayload = JSON.parse(JSON.stringify(validPayload));
  badPayload.query.travelers = -1;
  res = await requestAiItinerary(badPayload, { 'x-user-id': crypto.randomUUID() });
  console.log('Status (Expect 400):', res.status);
  
  // 4. Rate Limiting (5 per user)
  console.log('\n--- 4. Rate Limiting (User) ---');
  const anonId = crypto.randomUUID();
  for (let i = 1; i <= 6; i++) {
    res = await requestAiItinerary(validPayload, { 'x-user-id': anonId });
    console.log(`Request ${i} Status:`, res.status);
  }

  // 5. Rate Limiting (IP limit bypass attempt)
  console.log('\n--- 5. Rate Limiting (IP Limit) ---');
  // At this point the IP has made 6 requests (plus some bad ones). Let's make more to hit the IP limit (20).
  for (let i = 1; i <= 15; i++) {
    res = await requestAiItinerary(validPayload, { 'x-user-id': crypto.randomUUID() });
    if (res.status === 429) {
      console.log(`Hit IP Rate limit on request ${i}! Status:`, res.status);
      break;
    }
  }

  console.log('\nFinished Tests.');
}

testLimits();
