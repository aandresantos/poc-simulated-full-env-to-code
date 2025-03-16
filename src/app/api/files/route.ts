import { NextResponse } from "next/server";
import { existsSync, mkdirSync, writeFile } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { filename, content } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    const WORKSPACE_DIR = path.join(process.cwd(), "workspace");

    if (!existsSync(WORKSPACE_DIR)) {
      mkdirSync(WORKSPACE_DIR, { recursive: true });
    }

    const safeFilename = path.basename(filename);
    const filePath = path.join(WORKSPACE_DIR, safeFilename);

    await new Promise<void>((resolve, reject) => {
      writeFile(filePath, content || "", "utf8", (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    return NextResponse.json({
      message: "File created successfully",
      filename: safeFilename,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
