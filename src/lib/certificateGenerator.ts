import PDFDocument from 'pdfkit';

export async function generateCertificate(
    name: string,
    college: string,
    requestUrl: string
): Promise<Buffer> {

    const width = 1599;
    const height = 1131;

    // ── Fetch template image ──────────────────────────────────────────────────────────
    const baseUrl = new URL(requestUrl);
    const origin = `${baseUrl.protocol}//${baseUrl.host}`;
    const templateRes = await fetch(`${origin}/image_copy_7.png`);
    if (!templateRes.ok) throw new Error(`Template fetch failed: ${templateRes.status}`);
    const templateBuffer = Buffer.from(await templateRes.arrayBuffer());

    // Try loading a custom font family from public assets.
    // Fallback to built-in PDF fonts if unavailable.
    let certificateFont: Buffer | null = null;
    try {
        const fontRes = await fetch(`${origin}/fonts/pt-serif-bold.woff`);
        if (fontRes.ok) {
            certificateFont = Buffer.from(await fontRes.arrayBuffer());
        }
    } catch {
        // Ignore and use built-in fallback fonts.
    }

    // ── Create PDF with template image and text overlay ──────────────────────────────
    const pdf = new PDFDocument({
        size: [width, height],
        margin: 0,
        bufferPages: true,
    });

    // Add background image
    pdf.image(templateBuffer, 0, 0, { width, height });

    const nameText = name.toUpperCase().trim();
    const collegeText = college.toUpperCase().trim();

    // Slightly smaller text than before + dynamic scaling for long values.
    const nameFontSize = nameText.length > 18
        ? Math.max(24, 36 - (nameText.length - 18) * 0.8)
        : 36;
    const collegeFontSize = collegeText.length > 28
        ? Math.max(20, 28 - (collegeText.length - 28) * 0.4)
        : 28;

    // Keep visual baseline fixed even when font size changes.
    // drawY is derived from baselineY so text does not appear to jump vertically.
    const BASELINE_ASCENT_RATIO = 0.78;

    // Shift very long names left so they do not overlap right-side template initials.
    const nameLeftOffset = nameText.length > 32
        ? Math.min(110, Math.round((nameText.length - 32) * 5))
        : 0;
    const nameBoxX = 250 + nameLeftOffset;
    const nameBaselineY = 584;
    const nameBoxWidth = 1099;
    const nameDrawY = Math.round(nameBaselineY - nameFontSize * BASELINE_ASCENT_RATIO);

    const collegeBoxX = 250;
    const collegeBaselineY = 658;
    const collegeYOffset = -8;
    const collegeBoxWidth = 1099;
    const collegeDrawY = Math.round(
        collegeBaselineY + collegeYOffset - collegeFontSize * BASELINE_ASCENT_RATIO
    );

    // Add participant name
    if (certificateFont) {
        pdf.font(certificateFont);
    } else {
        pdf.font('Times-Bold');
    }

    pdf.fontSize(nameFontSize)
        .fillColor('#1B2631')
        .text(nameText, nameBoxX, nameDrawY, {
            width: nameBoxWidth,
            align: 'center',
            lineBreak: false,
        });

    // Add college text
    if (certificateFont) {
        pdf.font(certificateFont);
    } else {
        pdf.font('Times-Italic');
    }

    pdf.fontSize(collegeFontSize)
        .fillColor('#515a5a')
        .text(collegeText, collegeBoxX, collegeDrawY, {
            width: collegeBoxWidth,
            align: 'center',
            lineBreak: false,
        });

    // Buffer the PDF
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];

        pdf.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });

        pdf.on('end', () => {
            resolve(Buffer.concat(chunks));
        });

        pdf.on('error', (err) => {
            reject(err);
        });

        pdf.end();
    });
}
