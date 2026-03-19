import { Resvg } from '@resvg/resvg-js';

export async function generateCertificate(
    name: string,
    college: string,
    requestUrl: string
): Promise<Buffer> {

    // ── Fetch template image ──────────────────────────────────────────────────────────
    const baseUrl = new URL(requestUrl);
    const origin = `${baseUrl.protocol}//${baseUrl.host}`;
    const templateRes = await fetch(`${origin}/image_copy_7.png`);
    if (!templateRes.ok) throw new Error(`Template fetch failed: ${templateRes.status}`);
    const templateBuffer = Buffer.from(await templateRes.arrayBuffer());

    // ── Convert template to base64 ─────────────────────────────────────────────────────
    const templateBase64 = templateBuffer.toString('base64');

    // Escape XML/HTML entities in text
    const escapeXml = (str: string) => {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };

    const safeName = escapeXml(name.toUpperCase());
    const safeCollege = escapeXml(college.toUpperCase());

    // ── Create SVG with embedded template image ────────────────────────────────────────
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1599" height="1131" xmlns="http://www.w3.org/2000/svg">
  <!-- Background template image -->
  <image href="data:image/png;base64,${templateBase64}" x="0" y="0" width="1599" height="1131"/>
  
  <!-- Name text -->
  <text x="${1599 * 0.36}" y="594" 
        font-family="Arial, sans-serif" 
        font-size="54" 
        font-weight="bold" 
        fill="#1B2631"
        text-anchor="start">
    ${safeName}
  </text>
  
  <!-- College text -->
  <text x="${1599 * 0.26}" y="654" 
        font-family="Arial, sans-serif" 
        font-size="34" 
        font-style="italic" 
        fill="#515a5a"
        text-anchor="start">
    ${safeCollege}
  </text>
</svg>`;

    // ── Render SVG to PNG using resvg (Vercel-compatible) ───────────────────────────────
    const resvg = new Resvg(svg, {
        fitTo: {
            mode: 'original',
        },
        dpi: 96,
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return Buffer.from(pngBuffer);
}
