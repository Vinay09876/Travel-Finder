/**
 * Utility function to combine class names
 */
export function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ');
}

/**
 * Formats a numeric Indian Rupee amount with ₹ symbol and commas (e.g. ₹10,000)
 */
export function formatINR(amount: number): string {
  return '₹' + Math.abs(amount).toLocaleString('en-IN');
}

/**
 * Provides a reliable fallback image URL for a given destination ID
 * in case the primary image fails to load.
 */
export function getFallbackImage(destinationId?: string): string {
  // We use known working generic nature/travel Unsplash photo IDs for fallbacks
  const fallbacks: Record<string, string> = {
    goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    udaipur: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    gokarna: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
    rishikesh: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    pondicherry: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    default: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  };

  if (destinationId && fallbacks[destinationId]) {
    return fallbacks[destinationId];
  }
  return fallbacks['default'];
}
