/** Canonical client labels for filters and marker colors */
export const CLIENT_OPTIONS = [
  'Zepto',
  'Blinkit',
  // 'Zudio',
  'Instamart',
  'Flipkart',
]

const CLIENT_ALIASES = {
  zepto: 'Zepto',
  zep: 'Zepto',
  blinkit: 'Blinkit',
  blink: 'Blinkit',
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
  Instamart: '#EF4444',
  Flipkart: '#92400E',
}

/** Emoji fallback when logo image fails to load */
export const CLIENT_EMOJI = {
  Zepto: '⚡',
  Blinkit: '🛒',
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
  Instamart: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9JZmxlKwCiyRDy_puFiw-lww6Rx2O7QhXDw&s',
}

export function resolveCanonicalClient(raw) {
  if (raw == null || String(raw).trim() === '') return null
  const key = String(raw).trim().toLowerCase()
  return CLIENT_ALIASES[key] ?? null
}
