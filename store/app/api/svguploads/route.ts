import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

// Helper function to combine multiple SVGs vertically
async function combineSVGs(svgContents: string[]) {
  // Extract viewBox values and content from each SVG
  const svgElements = svgContents.map(content => {
    const viewBoxMatch = content.match(/viewBox=["']([^"']+)["']/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1].split(' ').map(Number) : [0, 0, 100, 100];
    const contentMatch = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
    const innerContent = contentMatch ? contentMatch[1] : '';
    return { viewBox, content: innerContent };
  });

  // Calculate combined viewBox
  const maxWidth = Math.max(...svgElements.map(({ viewBox }) => viewBox[2]));
  const totalHeight = svgElements.reduce((sum, { viewBox }) => sum + viewBox[3], 0);

  // Create combined SVG with vertical arrangement
  let combinedSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${maxWidth} ${totalHeight}">`;
  let currentY = 0;

  svgElements.forEach(({ viewBox, content }) => {
    // Calculate x offset to center the element if it's smaller than maxWidth
    const xOffset = (maxWidth - viewBox[2]) / 2;
    combinedSVG += `<g transform="translate(${xOffset}, ${currentY})">${content}</g>`;
    currentY += viewBox[3];
  });

  combinedSVG += '</svg>';
  return combinedSVG;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "No SVG files received." },
        { status: 400 }
      );
    }

    // Read all SVG contents
    const svgContents = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        return Buffer.from(bytes).toString();
      })
    );

    // Combine SVGs vertically
    const combinedSVG = await combineSVGs(svgContents);

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const svgFilename = `combined-${uniqueSuffix}.svg`;
    const svgPath = path.join(process.cwd(), "public", "uploads", svgFilename);

    // Save combined SVG
    await writeFile(svgPath, combinedSVG);

    // Convert to PNG
    const pngFilename = `combined-${uniqueSuffix}.png`;
    const pngPath = path.join(process.cwd(), "public", "uploads", pngFilename);
    
    // Use sharp to convert SVG to PNG while maintaining aspect ratio
    await sharp(svgPath)
      .png()
      .toFile(pngPath);

    // Generate URLs
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = request.headers.get("host") || "localhost:8000";
    const pngUrl = `${protocol}://${host}/uploads/${pngFilename}`;
    const svgUrl = `${protocol}://${host}/uploads/${svgFilename}`;

    return NextResponse.json({ pngUrl, svgUrl });
  } catch (error: any) {
    console.error("Error processing SVGs:", error);
    return NextResponse.json(
      { error: "Error processing SVG files", details: error.message },
      { status: 500 }
    );
  }
}