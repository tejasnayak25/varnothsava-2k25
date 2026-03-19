import PDFDocument from 'pdfkit';
import { fromPath } from 'pdf2pic';
import fs from 'fs';
import path from 'path';

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

    // ── Create PDF with text overlay ──────────────────────────────────────────────────
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: [1599, 1131],
                margin: 0,
            });

            // Add the template image as background
            const tempImagePath = path.join('/tmp', `temp_cert_${Date.now()}.png`);
            fs.writeFileSync(tempImagePath, templateBuffer);

            doc.image(tempImagePath, 0, 0, {
                width: 1599,
                height: 1131,
            });

            // Add name text
            const nameX = 1599 * 0.36;
            const nameY = 594;
            
            doc.fontSize(54)
                .font('Helvetica-Bold')
                .fillColor('#1B2631')
                .text(name.toUpperCase(), nameX, nameY, {
                    width: 1599 - nameX - 50,
                    align: 'left',
                });

            // Add college text
            const collegeX = 1599 * 0.26;
            const collegeY = 654;

            doc.fontSize(34)
                .font('Helvetica-Oblique')
                .fillColor('#515a5a')
                .text(college.toUpperCase(), collegeX, collegeY, {
                    width: 1599 - collegeX - 50,
                    align: 'left',
                });

            // Collect PDF data
            const chunks: Buffer[] = [];

            doc.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
            });

            doc.on('end', async () => {
                try {
                    const pdfBuffer = Buffer.concat(chunks);
                    
                    // Clean up temp image
                    fs.unlinkSync(tempImagePath);

                    // Convert PDF to PNG image
                    const tempPdfPath = path.join('/tmp', `temp_cert_${Date.now()}.pdf`);
                    fs.writeFileSync(tempPdfPath, pdfBuffer);

                    const converter = fromPath(tempPdfPath, {
                        density: 100,
                        saveFilename: `temp_cert_${Date.now()}`,
                        savePath: '/tmp',
                        format: 'png',
                        width: 1599,
                        height: 1131,
                    });

                    const pngResult = await converter(1);
                    const pngBuffer = fs.readFileSync((pngResult as any).path);

                    // Clean up temp files
                    fs.unlinkSync(tempPdfPath);
                    fs.unlinkSync((pngResult as any).path);

                    resolve(pngBuffer);
                } catch (err) {
                    reject(err);
                }
            });

            doc.on('error', (err: Error) => {
                reject(err);
            });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}
