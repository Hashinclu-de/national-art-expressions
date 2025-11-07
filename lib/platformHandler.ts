/**
 * Enhanced platform detection and rendering strategies
 */

export type PlatformType =
  | 'tinkercad'
  | 'figma'
  | 'unity'
  | 'code-org'
  | 'sharepoint-video'
  | 'sharepoint-powerpoint'
  | 'google-drive'
  | 'scratch'
  | 'website'
  | 'spatial'
  | 'other';

export type RenderStrategy =
  | 'iframe'           // Direct iframe embedding (works for websites, Scratch, Drive)
  | 'reverse-proxy'    // Proxy through our server
  | 'platform-api'     // Use platform's official API/SDK
  | 'three-js'         // Render 3D models with Three.js
  | 'screenshot'       // Static screenshot preview
  | 'external'         // Must open in new window
  | 'video-preview';   // Show video preview

export interface PlatformConfig {
  type: PlatformType;
  strategy: RenderStrategy[];  // Try strategies in order
  canEmbed: boolean;
  icon: string;
  color: string;
  apiAvailable: boolean;
  exportFormats?: string[];    // Available export formats (GLB, OBJ, etc.)
  sdkUrl?: string;             // SDK/API URL if available
}

/**
 * Detect platform and return rendering strategies
 */
export function detectPlatform(url: string, requirement?: string): PlatformConfig {
  const urlLower = url.toLowerCase();
  const reqLower = requirement?.toLowerCase() || '';

  // TinkerCAD - Can export 3D models
  if (urlLower.includes('tinkercad.com')) {
    return {
      type: 'tinkercad',
      strategy: ['three-js', 'reverse-proxy', 'screenshot', 'external'],
      canEmbed: false,
      icon: '',
      color: 'from-purple-400 to-blue-400',
      apiAvailable: false,
      exportFormats: ['glb', 'obj', 'stl'],
      sdkUrl: undefined,
    };
  }

  // Figma - Has official Embed API (actually works!)
  if (urlLower.includes('figma.com')) {
    return {
      type: 'figma',
      strategy: ['iframe'],  // Use iframe with transformed embed URL
      canEmbed: true,
      icon: '',
      color: 'from-violet-400 to-purple-400',
      apiAvailable: true,
      sdkUrl: 'https://www.figma.com/developers/embed',
    };
  }

  // Code.org - Check for embed options
  if (urlLower.includes('code.org')) {
    return {
      type: 'code-org',
      strategy: ['reverse-proxy', 'screenshot', 'external'],
      canEmbed: false,
      icon: '',
      color: 'from-teal-400 to-cyan-400',
      apiAvailable: false,
    };
  }

  // Unity - Can export WebGL
  if (reqLower.includes('unity')) {
    return {
      type: 'unity',
      strategy: ['video-preview', 'screenshot', 'external'],
      canEmbed: false,
      icon: '',
      color: 'from-gray-400 to-slate-400',
      apiAvailable: false,
      exportFormats: ['webgl'],
    };
  }

  // SharePoint Video
  if (urlLower.includes('sharepoint.com') && urlLower.includes('/:v:/')) {
    return {
      type: 'sharepoint-video',
      strategy: ['reverse-proxy', 'screenshot', 'external'],
      canEmbed: false,
      icon: '',
      color: 'from-red-400 to-pink-400',
      apiAvailable: false,
    };
  }

  // SharePoint PowerPoint
  if (urlLower.includes('sharepoint.com') && urlLower.includes('/:p:/')) {
    return {
      type: 'sharepoint-powerpoint',
      strategy: ['reverse-proxy', 'screenshot', 'external'],
      canEmbed: false,
      icon: '',
      color: 'from-orange-400 to-red-400',
      apiAvailable: false,
    };
  }

  // Spatial
  if (urlLower.includes('spatial.io')) {
    return {
      type: 'spatial',
      strategy: ['screenshot', 'external'],
      canEmbed: false,
      icon: '',
      color: 'from-indigo-400 to-blue-400',
      apiAvailable: false,
    };
  }

  // Google Drive - Works with iframe
  if (urlLower.includes('drive.google.com')) {
    return {
      type: 'google-drive',
      strategy: ['iframe'],
      canEmbed: true,
      icon: '',
      color: 'from-green-400 to-emerald-400',
      apiAvailable: false,
    };
  }

  // Scratch - Works with iframe
  if (urlLower.includes('scratch.mit.edu')) {
    return {
      type: 'scratch',
      strategy: ['iframe'],
      canEmbed: true,
      icon: '',
      color: 'from-orange-400 to-pink-400',
      apiAvailable: false,
    };
  }

  // Websites - Only specific trusted platforms
  if (urlLower.includes('site123.me') || urlLower.includes('gamma.site')) {
    return {
      type: 'website',
      strategy: ['iframe'],
      canEmbed: true,
      icon: '',
      color: 'from-blue-400 to-cyan-400',
      apiAvailable: false,
    };
  }

  // All other websites and unknown URLs - Don't embed
  return {
    type: 'other',
    strategy: ['external'],
    canEmbed: false,
    icon: '',
    color: 'from-gray-400 to-gray-500',
    apiAvailable: false,
  };
}

/**
 * Extract TinkerCAD thing ID from URL
 */
export function extractTinkerCadId(url: string): string | null {
  const match = url.match(/things\/([^/?]+)/);
  return match ? match[1] : null;
}

/**
 * Extract Figma file info from URL
 */
export function extractFigmaInfo(url: string): { fileId: string; nodeId?: string } | null {
  const protoMatch = url.match(/figma\.com\/proto\/([^/?]+)/);
  const fileMatch = url.match(/figma\.com\/file\/([^/?]+)/);
  const nodeMatch = url.match(/node-id=([^&]+)/);

  const fileId = protoMatch?.[1] || fileMatch?.[1];
  if (!fileId) return null;

  return {
    fileId,
    nodeId: nodeMatch?.[1]?.replace(/-/g, ':'),
  };
}

/**
 * Extract Code.org project ID
 */
export function extractCodeOrgId(url: string): string | null {
  const match = url.match(/projects\/\w+\/([^/?]+)/);
  return match ? match[1] : null;
}
