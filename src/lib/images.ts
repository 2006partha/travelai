/**
 * Image utility module for fetching and caching destination photos
 * Uses Unsplash API for high-quality travel images
 */

// Default travel destination keywords for each season/theme
const DESTINATION_KEYWORDS = {
  beach: ['beach', 'tropical', 'ocean', 'paradise', 'island'],
  mountains: ['mountain', 'alpine', 'hiking', 'peaks', 'landscape'],
  city: ['city', 'urban', 'skyline', 'architecture', 'metropolis'],
  adventure: ['adventure', 'hiking', 'outdoor', 'nature', 'exploration'],
  culture: ['culture', 'heritage', 'historical', 'ancient', 'tradition'],
  romantic: ['romantic', 'sunset', 'couple', 'destination', 'exotic'],
};

// Fallback image URLs (using public domain images from various sources)
const FALLBACK_IMAGES = {
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  mountains: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  city: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
  adventure: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
  culture: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  romantic: 'https://images.unsplash.com/photo-1488748807830-63789f68bb65?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1552882657-6658a0b3c5d1?w=800&q=80',
};

interface CachedImage {
  url: string;
  timestamp: number;
  title?: string;
}

interface ImageCache {
  [key: string]: CachedImage;
}

// In-memory cache (persisted across requests in server-side)
let imageCache: ImageCache = {};

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * Generate a search query for the destination
 */
function generateSearchQuery(destination: string, category?: string): string {
  const baseName = destination.toLowerCase().trim();
  const keywords = category ? DESTINATION_KEYWORDS[category as keyof typeof DESTINATION_KEYWORDS] : [];
  
  if (keywords && keywords.length > 0) {
    return `${baseName} ${keywords[Math.floor(Math.random() * keywords.length)]}`;
  }
  
  return baseName;
}

const FALLBACK_IDS = [
  "photo-1507525428034-b723cf961d3e",
  "photo-1506905925346-21bda4d32df4",
  "photo-1480714378408-67cf0d13bc1b",
  "photo-1469854523086-cc02fe5d8800",
  "photo-1488646953014-85cb44e25828",
  "photo-1488748807830-63789f68bb65",
  "photo-1501785888041-af3ef285b470",
  "photo-1519046904884-53103b34b206",
  "photo-1530789253516-ad46193de3f1",
  "photo-1476514525535-07fb3b4ae5f1"
];

function getFallbackUrl(query: string, width: number, quality: number): string {
  const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const id = FALLBACK_IDS[hash % FALLBACK_IDS.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

async function searchUnsplash(query: string, width: number): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' travel')}&per_page=1&orientation=landscape`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Client-ID ${accessKey}` },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
    }
  } catch (e) {
    // Silently fallback — don't log timeout errors
  }
  return null;
}

export async function fetchDestinationImage(
  destination: string,
  options?: {
    width?: number;
    quality?: number;
    category?: string;
    forceRefresh?: boolean;
  }
): Promise<string> {
  const width = options?.width || 800;
  const quality = options?.quality || 80;
  const forceRefresh = options?.forceRefresh || false;
  
  const cacheKey = `${destination}:${width}:${quality}:${options?.category || 'all'}`;
  
  // Check cache first
  if (!forceRefresh && imageCache[cacheKey]) {
    const cached = imageCache[cacheKey];
    if (Date.now() - cached.timestamp < CACHE_EXPIRATION) {
      return cached.url;
    }
  }
  
  // Try Unsplash Search API first
  const searchQuery = generateSearchQuery(destination, options?.category);
  const unsplashUrl = await searchUnsplash(searchQuery, width);
  const imageUrl = unsplashUrl || getFallbackUrl(searchQuery, width, quality);
  
  // Cache the result
  imageCache[cacheKey] = {
    url: imageUrl,
    timestamp: Date.now(),
    title: destination,
  };
  
  return imageUrl;
}

/**
 * Get multiple destination images
 */
export async function fetchMultipleDestinationImages(
  destinations: string[],
  options?: {
    width?: number;
    quality?: number;
    category?: string;
  }
): Promise<Map<string, string>> {
  const images = new Map<string, string>();
  
  // Fetch images in parallel (with some delay to avoid rate limiting)
  for (let i = 0; i < destinations.length; i++) {
    const destination = destinations[i];
    // Add slight delay between requests to avoid rate limiting
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const imageUrl = await fetchDestinationImage(destination, options);
    images.set(destination, imageUrl);
  }
  
  return images;
}

/**
 * Get a random banner image for a section
 */
export async function getRandomBannerImage(category: 'beach' | 'mountains' | 'city' | 'adventure' | 'culture' | 'romantic' = 'adventure'): Promise<string> {
  const keywords = DESTINATION_KEYWORDS[category];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  
  try {
    const imageUrl = buildUnsplashUrl(randomKeyword, 1600, 85);
    const response = await fetch(imageUrl, { method: 'HEAD', cache: 'no-store' });
    
    if (response.ok) {
      return imageUrl;
    }
  } catch (error) {
    console.warn(`Failed to fetch random banner for ${category}:`, error);
  }
  
  return FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
}

/**
 * Clear cache (useful for testing or user request)
 */
export function clearImageCache(): void {
  imageCache = {};
}

/**
 * Get cache statistics
 */
export function getImageCacheStats() {
  return {
    cachedImages: Object.keys(imageCache).length,
    cacheSize: Object.keys(imageCache).reduce((sum, key) => {
      const url = imageCache[key].url;
      return sum + (url ? url.length : 0);
    }, 0),
  };
}

/**
 * Generate a gradient placeholder while image loads
 */
export function getPlaceholderGradient(seed: string): string {
  const colors = [
    'from-amber-400 to-amber-600',
    'from-blue-400 to-blue-600',
    'from-emerald-400 to-emerald-600',
    'from-rose-400 to-rose-600',
    'from-purple-400 to-purple-600',
    'from-teal-400 to-teal-600',
  ];
  
  const hash = seed.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Optimize image URL for specific size
 */
export function optimizeImageUrl(url: string, width: number, height?: number): string {
  if (!url) return '';
  
  // If it's already an Unsplash URL, just modify the width
  if (url.includes('images.unsplash.com')) {
    const params = new URLSearchParams({
      w: width.toString(),
      q: '80',
      fit: 'crop',
      auto: 'format',
    });
    
    if (height) {
      params.set('h', height.toString());
    }
    
    return `${url.split('?')[0]}?${params.toString()}`;
  }
  
  return url;
}
