/**
 * Image Provider Abstraction
 * 
 * Provides destination-specific images. In the future, this can be expanded
 * to integrate with a real image API (like Unsplash API or Pexels) using
 * an API key.
 */

const FALLBACK_DESTINATION_IMAGES: Record<string, string> = {
  // India
  bengaluru: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80',
  hyderabad: 'https://images.unsplash.com/photo-1629853921200-5c62d0426f8d?auto=format&fit=crop&w=1600&q=80',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6858f?auto=format&fit=crop&w=1600&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
  udaipur: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1600&q=80',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
  gokarna: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
  pondicherry: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
  pune: 'https://images.unsplash.com/photo-1600021625907-79b8d23d8c11?auto=format&fit=crop&w=1600&q=80',
  amritsar: 'https://images.unsplash.com/photo-1563204909-6bc2e30372f7?auto=format&fit=crop&w=1600&q=80',

  // International
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59693e0cd8ce?auto=format&fit=crop&w=1600&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80'
};

const GENERIC_FALLBACK = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80';

export async function getDestinationImage(destinationName: string): Promise<string> {
  // TODO: Add dynamic API call here (e.g. Unsplash API) once an API key is provided
  // For now, use the curated mapping
  const normalizedName = destinationName.toLowerCase().trim();
  
  if (FALLBACK_DESTINATION_IMAGES[normalizedName]) {
    return FALLBACK_DESTINATION_IMAGES[normalizedName];
  }
  
  return GENERIC_FALLBACK;
}
