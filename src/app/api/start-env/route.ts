import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { existsSync, mkdirSync } from "fs";

const execPromise = (
  command: string
): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject({ error, stderr });
      }
      resolve({ stdout, stderr });
    });
  });
};

export async function POST(request: Request) {
  const WORKSPACE_DIR = path.join(process.cwd(), "workspace");

  if (!existsSync(WORKSPACE_DIR)) {
    try {
      mkdirSync(WORKSPACE_DIR, { recursive: true });
    } catch (error: any) {
      console.error("Error creating workspace directory:", error);
      return NextResponse.json(
        { error: "Failed to create workspace directory" },
        { status: 500 }
      );
    }
  }

  const { userId } = await request.json();

  console.log(userId);

  const containerName = `env_${userId}`;

  // Build the Docker run command:
  // - `-d` runs the container in detached mode.
  // - `--name` assigns a name.
  // - `-v` mounts the workspace directory to /workspace inside the container.
  // - "tail -f /dev/null" keeps the container running.
  const command = `docker run -d --name ${containerName} -v ${WORKSPACE_DIR}:/workspace node:alpine tail -f /dev/null`;

  try {
    const { stdout } = await execPromise(command);

    return NextResponse.json({
      message: "Environment started",
      containerId: stdout.trim(),
      containerName,
    });
  } catch (error: any) {
    console.error("Error starting container:", error.error);
    return NextResponse.json(
      { error: error.error.message, stderr: error.stderr },
      { status: 500 }
    );
  }
}
