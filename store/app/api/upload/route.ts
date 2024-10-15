import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const vendorId = request.cookies.get("vendor_id");
    console.log("Vendor Dashboard Vendor ID is: ",vendorId)
    const file = formData.get("file") as Blob | null;
    const fileName = (formData.get("file") as any).name;
    if (!file) {
        return NextResponse.json(
            { error: "File blob is required." },
            { status: 400 }
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const relativeUploadDir = `/uploads/images`;
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);
    console.log(uploadDir);
    
    try {
       
         if(! (await stat(uploadDir)).isDirectory){
            await mkdir(uploadDir, { recursive: true });
        }
    } catch (e: any) {
        console.log(e);
        
        if (e.code === "ENOENT") {
            await mkdir(uploadDir, { recursive: true });
        } else {
            console.error(
                "Error while trying to create directory when uploading a file\n",
                e
            );
            return NextResponse.json(
                { error: "Something went wrong." },
                { status: 500 }
            );
        }
    }

    try {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${fileName.replace(
            /\.[^/.]+$/,
            ""
        )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
        console.log(`${uploadDir}/${filename}`);
        
        await writeFile(`${uploadDir}/${filename}`, buffer);
        return NextResponse.json({ fileUrl: `${relativeUploadDir}/${filename}` });
    } catch (e) {
        console.error("Error while trying to upload a file\n", e);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}