import chromium from 'chrome-aws-lambda';

export async function generatePDF(content: string): Promise<Buffer> {
    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
    });

    const page = await browser.newPage();

    await page.setContent(content);

    const pdf = await page.pdf({
        format: 'a4',
        landscape: true,
        path: process.env.IS_OFFLINE ? 'certificate.pdf' : null,
        printBackground: true,
        preferCSSPageSize: true,
    });

    await browser.close();

    return pdf;
}
