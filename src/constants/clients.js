/** Canonical client labels for filters and marker colors */
export const CLIENT_OPTIONS = [
  'Zepto',
  'Blinkit',
  // 'Zudio',
  'Instamart',
  'Flipkart',
  'Big Basket',
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
  'big basket': 'Big Basket',
  bigbasket: 'Big Basket',
  'big-basket': 'Big Basket',
  bb: 'Big Basket',
}

/** Brand colors aligned with dashboard legend (purple / peach / blue / red / brown) */
export const CLIENT_COLORS = {
  Zepto: '#7C3AED',
  Blinkit: '#FBBF77',
  Instamart: '#EF4444',
  Flipkart: '#92400E',
  'Big Basket': '#84CC16',
}

/** Emoji fallback when logo image fails to load */
export const CLIENT_EMOJI = {
  Zepto: '⚡',
  Blinkit: '🛒',
  Instamart: '🏪',
  Flipkart: '📦',
  'Big Basket': '🛒',
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
  'Big Basket':
    'https://images.jdmagicbox.com/v2/comp/bangalore/a8/080pxx80.xx80.170928163206.n2a8/catalogue/big-basket-banaswadi-bangalore-online-shopping-websites-gitponew34.jpg',
}

export function resolveCanonicalClient(raw) {
  if (raw == null || String(raw).trim() === '') return null
  const key = String(raw).trim().toLowerCase()
  return CLIENT_ALIASES[key] ?? null
}
