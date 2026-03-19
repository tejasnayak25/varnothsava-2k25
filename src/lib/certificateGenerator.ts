import puppeteer from 'puppeteer';

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
    const templateBase64 = templateBuffer.toString('base64');

    // Escape HTML entities
    const escapeHtml = (str: string) => {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const safeName = escapeHtml(name.toUpperCase());
    const safeCollege = escapeHtml(college.toUpperCase());

    // ── Create HTML with embedded certificate ──────────────────────────────────────────
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: transparent;
                }
                .certificate {
                    position: relative;
                    width: 1599px;
                    height: 1131px;
                    margin: 0;
                    padding: 0;
                }
                .certificate img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .name {
                    position: absolute;
                    left: ${1599 * 0.36}px;
                    top: 594px;
                    font-size: 54px;
                    font-weight: bold;
                    color: #1B2631;
                    font-family: Arial, sans-serif;
                    max-width: ${1599 - 1599 * 0.36 - 50}px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                }
                .college {
                    position: absolute;
                    left: ${1599 * 0.26}px;
                    top: 654px;
                    font-size: 34px;
                    font-style: italic;
                    color: #515a5a;
                    font-family: Arial, sans-serif;
                    max-width: ${1599 - 1599 * 0.26 - 50}px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                }
            </style>
        </head>
        <body>
            <div class="certificate">
                <img src="data:image/png;base64,${templateBase64}" alt="Certificate">
                <div class="name">${safeName}</div>
                <div class="college">${safeCollege}</div>
            </div>
        </body>
        </html>
    `;

    // ── Use Puppeteer to render HTML to PNG ────────────────────────────────────────────
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--single-process',
                '--no-first-run',
            ],
        });

        const page = await browser.newPage();
        
        // Set viewport to exact certificate size
        await page.setViewport({
            width: 1599,
            height: 1131,
            deviceScaleFactor: 1,
        });

        // Load HTML content
        await page.setContent(html, {
            waitUntil: 'networkidle0',
        });

        // Take screenshot
        const pngBuffer = await page.screenshot({
            type: 'png',
            omitBackground: false,
        }) as Buffer;

        await page.close();
        return pngBuffer;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
