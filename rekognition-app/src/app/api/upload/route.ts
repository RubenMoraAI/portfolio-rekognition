import { NextRequest, NextResponse } from "next/server";
import {
  ensureCollectionExists,
  processImage,
  deleteIndexedFaces,
  type IndexedFace,
} from "@/lib/processImage";

export async function POST(req: NextRequest) {
  try {
    await ensureCollectionExists();

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No images provided" },
        { status: 400 }
      );
    }

    const allIndexedFaces: IndexedFace[] = [];
    const results = [];

    for (const file of files) {
      const result = await processImage(file, allIndexedFaces);
      results.push(result);
    }

    await deleteIndexedFaces(allIndexedFaces);

    return NextResponse.json({
      success: true,
      message: "Images processed successfully",
      data: results,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", data: null },
      { status: 500 }
    );
  }
}
