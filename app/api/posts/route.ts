import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const { title, content, coverImage } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        coverImage,
        published: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
