import crypto from 'crypto';

async function testDebug() {
  const payload = {
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

  const res = await fetch('http://localhost:3000/api/ai-itinerary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': crypto.randomUUID()
    },
    body: JSON.stringify(payload)
  });
  
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
}

testDebug();
