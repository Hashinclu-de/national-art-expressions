/**
 * Transforms URLs to their embed-friendly versions where possible
 */
export function getEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url);

    // Google Drive - convert view links to preview/embed
    if (urlObj.hostname.includes('drive.google.com')) {
      // Handle different Google Drive URL formats
      if (url.includes('/file/d/')) {
        const fileId = url.match(/\/file\/d\/([^/]+)/)?.[1];
        if (fileId) {
          return `https://drive.google.com/file/d/${fileId}/preview`;
        }
      }
      if (url.includes('/open?id=')) {
        const fileId = urlObj.searchParams.get('id');
        if (fileId) {
          return `https://drive.google.com/file/d/${fileId}/preview`;
        }
      }
    }

    // Scratch - add /embed for projects
    if (urlObj.hostname.includes('scratch.mit.edu') && url.includes('/projects/')) {
      const projectId = url.match(/\/projects\/(\d+)/)?.[1];
      if (projectId) {
        return `https://scratch.mit.edu/projects/${projectId}/embed`;
      }
    }

    // TinkerCAD - already supports embedding, just return as-is
    if (urlObj.hostname.includes('tinkercad.com')) {
      return url;
    }

    // Spatial - try to use embed format
    if (urlObj.hostname.includes('spatial.io')) {
      return url;
    }

    // SharePoint/OneDrive
    if (urlObj.hostname.includes('sharepoint.com') || urlObj.hostname.includes('1drv.ms')) {
      // Check if it's a video (:v:), PowerPoint (:p:), or other file type
      if (url.includes('/:v:/')) {
        // Video file - use embed parameter
        if (!url.includes('embed')) {
          const separator = url.includes('?') ? '&' : '?';
          return `${url}${separator}action=embedview&autoplay=false`;
        }
      } else if (url.includes('/:p:/')) {
        // PowerPoint - use embed parameter
        if (!url.includes('action=embedview')) {
          const separator = url.includes('?') ? '&' : '?';
          return `${url}${separator}action=embedview`;
        }
      } else {
        // Other files - use default embed
        if (!url.includes('action=embedview')) {
          const separator = url.includes('?') ? '&' : '?';
          return `${url}${separator}action=embedview`;
        }
      }
    }

    // YouTube - convert to embed
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get('v') || '';
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Vimeo - convert to embed
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/')[1];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }

    // Figma - use official embed API
    if (urlObj.hostname.includes('figma.com')) {
      // Don't transform if it's already an embed URL
      if (url.includes('/embed?')) {
        return url;
      }

      // Use Figma's official embed format
      // Works for both /proto/ and /file/ links
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    }

    // Default: return original URL
    return url;
  } catch (error) {
    // If URL parsing fails, return original
    return url;
  }
}

/**
 * Checks if a URL is likely to support embedding
 */
export function canEmbed(url: string): boolean {
  const embedFriendlyDomains = [
    'site123.me',
    'gamma.site',
    'wixsite.com',
    'wordpress.com',
    'weebly.com',
    'squarespace.com',
    'youtube.com',
    'youtu.be',
    'vimeo.com',
    'figma.com',
    'tinkercad.com',
    'scratch.mit.edu',
    'spatial.io'
  ];

  try {
    const urlObj = new URL(url);
    return embedFriendlyDomains.some(domain => urlObj.hostname.includes(domain)) ||
           url.includes('drive.google.com');
  } catch {
    return false;
  }
}
