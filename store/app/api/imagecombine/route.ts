import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

interface DesignRequest {
  backgroundUrl: string;
  foregroundUrl: string;
  width: number;
  height: number;
}

export async function POST(request: Request) {
  try {
    const data: DesignRequest = await request.json();
    const { backgroundUrl, foregroundUrl, width, height } = data;

    // Download both images
    const [backgroundRes, foregroundRes] = await Promise.all([
      fetch(backgroundUrl),
      fetch(foregroundUrl)
    ]);

    const [backgroundBuffer, foregroundBuffer] = await Promise.all([
      backgroundRes.arrayBuffer(),
      foregroundRes.arrayBuffer()
    ]);

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const outputFilename = `composite-${uniqueSuffix}.png`;
    const outputPath = path.join(process.cwd(), "public", "uploads", outputFilename);

    // Combine images using sharp
    await sharp(Buffer.from(backgroundBuffer))
      .resize(width, height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .composite([
        {
          input: Buffer.from(foregroundBuffer),
          blend: 'over',
          gravity: 'center'
        }
      ])
      .png()
      .toFile(outputPath);

    // Generate URL for the combined image
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = request.headers.get("host") || "localhost:8000";
    const combinedImageUrl = `${protocol}://${host}/uploads/${outputFilename}`;

    return NextResponse.json({ url: combinedImageUrl });
  } catch (error: any) {
    console.error("Error combining images:", error);
    return NextResponse.json(
      { error: "Error combining images", details: error.message },
      { status: 500 }
    );
  }
}