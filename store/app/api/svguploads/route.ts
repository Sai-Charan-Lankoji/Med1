import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp'; // Using sharp for SVG to PNG conversion

export async function POST(request: Request) { 
  try {
    // Get the form data and extract the file
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No SVG file received.' }, { status: 400 });
    }

    // Ensure the uploaded file is SVG
    // if (!file.type.includes('svg')) {
    //   return NextResponse.json({ error: 'Invalid file type. Only SVGs are allowed.' }, { status: 400 });
    // }

    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const svgFilename = `${originalName}-${uniqueSuffix}.svg`;

    // Save the SVG file
    const bytes = await file.arrayBuffer(); 
    const buffer = Buffer.from(bytes);
    const svgPath = path.join(process.cwd(), 'public', 'uploads', svgFilename); 
    await writeFile(svgPath, buffer);

    // Convert SVG to PNG using sharp
    const pngFilename = `${originalName}-${uniqueSuffix}.png`;
    const pngPath = path.join(process.cwd(), 'public', 'uploads', pngFilename);
    await sharp(svgPath)
      .png()
      .toFile(pngPath);

    // Generate the URL for the PNG file
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:8000';
    const fileUrl = `${protocol}://${host}/uploads/${pngFilename}`;

    // Respond with the URL of the PNG file
    return NextResponse.json({ fileUrl });
  } catch (error: any) {
    console.error('Error processing SVG:', error);
    return NextResponse.json({ error: 'Error processing SVG file', details: error.message }, { status: 500 });
  }
}
