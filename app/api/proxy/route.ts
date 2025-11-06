import { NextRequest, NextResponse } from 'next/server';

/**
 * Reverse proxy API route to bypass X-Frame-Options
 *
 * WARNING: This approach has limitations:
 * - May violate terms of service
 * - Won't work for authenticated content
 * - May be blocked by CORS
 * - Performance overhead
 *
 * Use only as fallback for exhibition purposes
 */
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    // Fetch the external content
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      // Don't follow redirects automatically
      redirect: 'manual',
    });

    // Handle redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        return NextResponse.json({
          error: 'Redirect detected',
          redirect: location,
        }, { status: 302 });
      }
    }

    // Check if request was successful
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch content: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get content type
    const contentType = response.headers.get('content-type') || 'text/html';

    // Get the content
    const content = await response.text();

    // Create response with stripped security headers
    const proxyResponse = new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        // Explicitly allow iframe embedding
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': 'frame-ancestors *',
      },
    });

    return proxyResponse;

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Support OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
