import { GET } from './app/api/destinations/[id]/route';

async function testDetail(id: string) {
  // Pass a dummy request. URL doesn't matter since the route extracts 'id' from params
  const req = new Request('http://localhost:3000/api/destinations/' + id);
  const params = Promise.resolve({ id });
  
  const res = await GET(req, { params });
  const data = await res.json();
  
  if (!data.destination) {
    console.error(`Detail failed for ${id}: no destination object`, data);
    return;
  }
  
  const dest = data.destination;
  if (dest.id === id && dest.name && dest.transportOptions && dest.stayOptions) {
    console.log(`✅ Detail API for ${id} returned full destination structure.`);
  } else {
    console.error(`❌ Detail API for ${id} returned incomplete data.`);
  }
}

async function main() {
  console.log('Testing Destination Detail API...\n');
  await testDetail('goa');
  await testDetail('udaipur');
}

main().catch(console.error);
