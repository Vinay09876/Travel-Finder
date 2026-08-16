export interface OsmPoi {
  name: string;
  type: string;
  lat: number;
  lon: number;
}

export async function fetchTopOsmPois(lat: number, lon: number): Promise<OsmPoi[]> {
  console.log(`[fetchTopOsmPois] Requesting POIs for Lat: ${lat}, Lon: ${lon}`);
  // Query within 10km bounding box using around:10000
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["tourism"~"museum|attraction|viewpoint|gallery"](around:10000, ${lat}, ${lon});
      node["historic"](around:10000, ${lat}, ${lon});
      node["leisure"~"park|nature_reserve"](around:10000, ${lat}, ${lon});
      node["natural"~"beach|peak"](around:10000, ${lat}, ${lon});
      node["amenity"~"place_of_worship"](around:10000, ${lat}, ${lon});
    );
    out body 50;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(overpassQuery),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'TravelFinderApp/1.0'
      }
    });

    console.log(`[fetchTopOsmPois] Response HTTP Status: ${response.status}`);
    if (!response.ok) {
      console.error(`[fetchTopOsmPois] Error response body: ${await response.text()}`);
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();
    const pois: OsmPoi[] = [];
    const seenNames = new Set<string>();

    for (const el of data.elements) {
      const name = el.tags?.name || el.tags?.['name:en'];
      if (!name) continue;

      if (seenNames.has(name)) continue;
      seenNames.add(name);

      let type = 'attraction';
      if (el.tags.tourism) type = el.tags.tourism;
      else if (el.tags.historic) type = 'historic';
      else if (el.tags.leisure) type = el.tags.leisure;
      else if (el.tags.natural) type = el.tags.natural;
      else if (el.tags.amenity) type = el.tags.amenity;

      pois.push({
        name,
        type,
        lat: el.lat,
        lon: el.lon
      });
    }

    // Sort to prioritize museums/historic/attractions
    pois.sort((a, b) => {
      const isTopA = /museum|historic|attraction/.test(a.type) ? -1 : 1;
      const isTopB = /museum|historic|attraction/.test(b.type) ? -1 : 1;
      return isTopA - isTopB;
    });

    const finalPois = pois.slice(0, 15);
    console.log(`[fetchTopOsmPois] Returning ${finalPois.length} POIs`);
    if (finalPois.length > 0) {
        console.log(`[fetchTopOsmPois] First few POIs: ${finalPois.slice(0, 5).map(p => p.name).join(', ')}`);
    }
    
    // Return max 15 POIs to give Gemini a factual set
    return finalPois;
  } catch (error) {
    console.error("OSM POI Fetch error:", error);
    return [];
  }
}
