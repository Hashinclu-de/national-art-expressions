/**
 * Thumbnail helper utilities
 *
 * How to add thumbnails:
 * 1. Take a screenshot of the artwork
 * 2. Save as: /public/thumbnails/{artworkNo}.jpg (or .png, .webp)
 * 3. Example: /public/thumbnails/5008.jpg
 *
 * If no local thumbnail exists, falls back to Unsplash placeholder
 */

export function getThumbnailPath(artworkNo: string | number, category?: string): string {
  // Primary: Try local thumbnail
  return `/thumbnails/${artworkNo}.jpg`;
}

export function getPlaceholderImage(category?: string, artworkNo?: string | number): string {
  // Use picsum.photos for reliable placeholder images
  const seed = artworkNo || Math.floor(Math.random() * 1000);

  // Use seed for consistent images per artwork
  return `https://picsum.photos/seed/${seed}/800/600`;
}

function getCategoryKeywords(category?: string): string {
  const categoryMap: { [key: string]: string } = {
    '3D Modeling': 'sculpture,3d,art,design',
    'Animation': 'animation,motion,digital,art',
    'Game Design': 'gaming,videogame,controller,design',
    'Video Game Design': 'videogame,game,technology,art',
    'Web Design': 'website,interface,ui,design',
  };

  return categoryMap[category || ''] || 'digital,art,creative,design';
}
