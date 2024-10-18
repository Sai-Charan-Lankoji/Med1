import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) { 
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    // Generate a unique filename to avoid overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const fileExtension = path.extname(file.name);
    const filename = `${originalName}-${uniqueSuffix}${fileExtension}`;

    // Save file to the public/uploads directory
    const bytes = await file.arrayBuffer(); 
    

    const buffer = Buffer.from(bytes);
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename); 
    await writeFile(filepath, buffer);

    // Generate the URL for the saved file
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:8004';
    const fileUrl = `${protocol}://${host}/uploads/${filename}`;

    return NextResponse.json({ fileUrl });
  } catch (error : any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file', details: error.message }, { status: 500 });
  }
}