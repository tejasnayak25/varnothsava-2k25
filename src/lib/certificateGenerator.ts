import PDFDocument from 'pdfkit';

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

    // ── Create PDF with template image and text overlay ──────────────────────────────
    const pdf = new PDFDocument({
        size: [1599, 1131],
        margin: 0,
        bufferPages: true,
    });

    // Add background image
    pdf.image(templateBuffer, 0, 0, { width: 1599, height: 1131 });

    // Add name text (without specifying font to avoid file issues)
    pdf.fontSize(54)
        .fillColor('#1B2631')
        .text(name.toUpperCase(), 1599 * 0.36, 594, {
            width: 1599 - 1599 * 0.36 - 50,
            align: 'left',
        });

    // Add college text
    pdf.fontSize(34)
        .fillColor('#515a5a')
        .text(college.toUpperCase(), 1599 * 0.26, 654, {
            width: 1599 - 1599 * 0.26 - 50,
            align: 'left',
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
