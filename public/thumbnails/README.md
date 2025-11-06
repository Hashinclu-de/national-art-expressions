# Artwork Thumbnails

## How It Works (3-Level Fallback System)

The system automatically tries to load images in this order:

1. **Local thumbnail** (your screenshots) - Best quality, fast loading
2. **Picsum placeholder** (random photos) - Good for testing/temporary
3. **Gradient fallback** (colored background) - Always works

## How to Add Your Own Thumbnails

1. **Take a screenshot** of each artwork
   - For websites: Full page screenshot
   - For Figma: Export or screenshot the prototype
   - For TinkerCAD: Screenshot of the 3D model
   - For videos: A representative frame
   - For presentations: First slide or cover

2. **Save the image** in this folder (`/public/thumbnails/`)
   - File name format: `{artworkNo}.jpg`
   - Examples:
     - `536.jpg` for artwork #536 (Figma)
     - `5008.jpg` for artwork #5008 (TinkerCAD)
     - `5119.jpg` for artwork #5119 (SharePoint video)

3. **Supported formats:**
   - `.jpg` or `.jpeg` (recommended)
   - `.png` (for transparency)
   - `.webp` (for better compression)

4. **Image recommendations:**
   - Resolution: At least 800x600px
   - Aspect ratio: 4:3 (matches card design)
   - File size: Keep under 500KB for fast loading

## Current Status

**Right now:** All artworks show **Picsum placeholder images** (random photos, consistent per artwork number)

**For exhibition:** Replace with actual screenshots by saving them here

## Current Artworks

Your catalog has 27 artworks. Here are the ones that need thumbnails most:

### TinkerCAD (cannot embed)
- 5008 - Magnificent Wluff Lappi
- 5009 - Ain Alfaydah School
- 5010 - Copy of Emirates Mars Mission
- 5013 - Liwa Fort

### SharePoint Video (cannot embed)
- 5119 - Journey in UAE

### Figma (embeds in modal but thumbnail shows in grid)
- 536 - Untitled 50

### Code.org (cannot embed)
- Various artworks

## Quick Start

```bash
# Example: Save Figma screenshot
# 1. Open Figma in browser
# 2. Press Cmd+Shift+4 (Mac) or Win+Shift+S (Windows)
# 3. Capture the artwork
# 4. Save as: public/thumbnails/536.jpg
```

After adding thumbnails, they will appear automatically on page refresh!
