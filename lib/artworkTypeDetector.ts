export type ArtworkType = 'website' | 'scratch' | 'tinkercad' | 'drive' | 'figma' | 'unity' | 'spatial' | 'code' | 'other';

export interface ArtworkTypeInfo {
  type: ArtworkType;
  canEmbed: boolean;
  icon: string;
  color: string;
}

export function detectArtworkType(url: string, requirement?: string): ArtworkTypeInfo {
  const urlLower = url.toLowerCase();
  const reqLower = requirement?.toLowerCase() || '';

  // Website builders - can embed
  if (urlLower.includes('site123.me') || urlLower.includes('gamma.site') ||
      urlLower.includes('wixsite.com') || urlLower.includes('wordpress.com')) {
    return {
      type: 'website',
      canEmbed: true,
      icon: '',
      color: 'from-blue-400 to-cyan-400'
    };
  }

  // Scratch - can embed with /embed
  if (urlLower.includes('scratch.mit.edu')) {
    return {
      type: 'scratch',
      canEmbed: true,
      icon: '',
      color: 'from-orange-400 to-pink-400'
    };
  }

  // TinkerCAD - blocked
  if (urlLower.includes('tinkercad.com') || reqLower.includes('tinkercad')) {
    return {
      type: 'tinkercad',
      canEmbed: false,
      icon: '',
      color: 'from-purple-400 to-blue-400'
    };
  }

  // Google Drive - preview works for some
  if (urlLower.includes('drive.google.com')) {
    return {
      type: 'drive',
      canEmbed: true,
      icon: '',
      color: 'from-green-400 to-emerald-400'
    };
  }

  // Figma - Official embed API works!
  if (urlLower.includes('figma.com')) {
    return {
      type: 'figma',
      canEmbed: true,  // Figma allows embedding via official API
      icon: '',
      color: 'from-violet-400 to-purple-400'
    };
  }

  // Unity - blocked
  if (reqLower.includes('unity')) {
    return {
      type: 'unity',
      canEmbed: false,
      icon: '',
      color: 'from-gray-400 to-slate-400'
    };
  }

  // Spatial - blocked
  if (urlLower.includes('spatial.io')) {
    return {
      type: 'spatial',
      canEmbed: false,
      icon: '',
      color: 'from-indigo-400 to-blue-400'
    };
  }

  // Studio Code - blocked
  if (urlLower.includes('studio.code.org') || urlLower.includes('code.org')) {
    return {
      type: 'code',
      canEmbed: false,
      icon: '',
      color: 'from-teal-400 to-cyan-400'
    };
  }

  // SharePoint/OneDrive - Most organizational SharePoint blocks iframe embedding
  if (urlLower.includes('sharepoint.com') || urlLower.includes('1drv.ms')) {
    // Check if it's a video
    if (urlLower.includes('/:v:/')) {
      return {
        type: 'drive',
        canEmbed: false,
        icon: '',
        color: 'from-red-400 to-pink-400'
      };
    }
    // Check if it's a PowerPoint
    if (urlLower.includes('/:p:/')) {
      return {
        type: 'drive',
        canEmbed: false,
        icon: '',
        color: 'from-orange-400 to-red-400'
      };
    }
    // Other SharePoint files
    return {
      type: 'drive',
      canEmbed: false,
      icon: '',
      color: 'from-blue-400 to-indigo-400'
    };
  }

  // Default
  return {
    type: 'other',
    canEmbed: false,
    icon: '',
    color: 'from-gray-400 to-gray-500'
  };
}
