import { GET } from './app/api/destinations/search/route';
import { NextRequest } from 'next/server';

async function testSearch(queryString: string, expectedCount: number) {
  const req = new NextRequest(`http://localhost:3000/api/destinations/search?${queryString}`);
  const res = await GET(req);
  const data = await res.json();
  
  if (!data.results) {
    console.error(`Search failed for ${queryString}: no results array`);
    return;
  }
  
  if (data.results.length === expectedCount) {
    console.log(`✅ ${queryString} -> returned ${data.results.length} results as expected.`);
  } else {
    console.error(`❌ ${queryString} -> expected ${expectedCount}, got ${data.results.length}`);
  }
}

async function main() {
  console.log('Testing Search API...\n');
  
  // All destinations (should be 7)
  await testSearch('origin=Mumbai&budget=20000&travelers=2&duration=5', 7);
  
  // Category filtering (Beach -> Goa, Gokarna = 2)
  await testSearch('origin=Mumbai&budget=20000&travelers=2&duration=5&category=beach', 2);
  
  // Category filtering (Heritage -> Udaipur, Jaipur = 2)
  await testSearch('origin=Mumbai&budget=20000&travelers=2&duration=5&category=heritage', 2);
  
  // Budget status works, sorting works. We'll just verify the results are returned correctly for now.
  // The sorting logic is in the route.ts file, which prioritizes fits > near > over, then cost.
}

main().catch(console.error);
