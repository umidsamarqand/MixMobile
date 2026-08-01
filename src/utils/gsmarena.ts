/**
 * Utility to generate dynamic GSMArena URL links and phone specifications links.
 */

/**
 * Generates GSMArena URL for a phone or model.
 * If gsmarena_url is provided, returns that direct URL.
 * Otherwise fallback search link: https://www.gsmarena.com/res.php3?sSearch=[BRAND]+[MODEL]
 */
export function getGsmArenaUrl(
  brand?: string,
  modelName?: string,
  customGsmArenaUrl?: string
): string {
  if (customGsmArenaUrl && customGsmArenaUrl.trim().length > 0) {
    return customGsmArenaUrl.trim();
  }

  const cleanBrand = (brand || '').trim();
  const cleanModel = (modelName || '').trim();
  const query = `${cleanBrand} ${cleanModel}`.trim();

  if (!query) {
    return 'https://www.gsmarena.com';
  }

  const formattedQuery = encodeURIComponent(query).replace(/%20/g, '+');
  return `https://www.gsmarena.com/res.php3?sSearch=${formattedQuery}`;
}
