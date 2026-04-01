/** Canonical client labels for filters and marker colors */
export const CLIENT_OPTIONS = [
  'Zepto',
  'Blinkit',
  'Zudio',
  'Instamart',
  'Flipkart',
]

const CLIENT_ALIASES = {
  zepto: 'Zepto',
  zep: 'Zepto',
  blinkit: 'Blinkit',
  blink: 'Blinkit',
  zudio: 'Zudio',
  instamart: 'Instamart',
  'insta mart': 'Instamart',
  insta: 'Instamart',
  flipkart: 'Flipkart',
  fk: 'Flipkart',
  flip: 'Flipkart',
}

/** Brand colors aligned with dashboard legend (purple / peach / blue / red / brown) */
export const CLIENT_COLORS = {
  Zepto: '#7C3AED',
  Blinkit: '#FBBF77',
  Zudio: '#3B82F6',
  Instamart: '#EF4444',
  Flipkart: '#92400E',
}

/** Emoji fallback when logo image fails to load */
export const CLIENT_EMOJI = {
  Zepto: '⚡',
  Blinkit: '🛒',
  Zudio: '👕',
  Instamart: '🏪',
  Flipkart: '📦',
}

/**
 * Public HTTPS logo URLs per brand (map + list). Replace if a host blocks hotlinking.
 */
export const CLIENT_ICON_URL = {
  Zepto:
    'https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/zepto-logo-app-icon-hd.png',
  Blinkit: 'https://cdn.siasat.com/wp-content/uploads/2023/02/Blinkit.jpg',
  Flipkart:
    'https://static.vecteezy.com/system/resources/thumbnails/054/650/802/small_2x/flipkart-logo-rounded-flipkart-logo-free-download-flipkart-logo-free-png.png',
  Zudio: 'https://images.seeklogo.com/logo-png/44/2/zudio-logo-svg-vector.png',
  Instamart: 'https://1000logos.net/wp-content/uploads/2021/05/Swiggy-Instamart-Logo.png',
}

export function resolveCanonicalClient(raw) {
  if (raw == null || String(raw).trim() === '') return null
  const key = String(raw).trim().toLowerCase()
  return CLIENT_ALIASES[key] ?? null
}
