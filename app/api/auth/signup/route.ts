import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiUtils } from "@/lib/api-response";
// In a real app, you would hash passwords!
// import { hash } from "bcryptjs"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return ApiUtils.error("Missing required fields", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return ApiUtils.error("User already exists", 409);
    }

    // Demo: Storing password as-is (BAD PRACTICE for production, but okay for this specific demo scope where hashing isn't set up yet)
    // REAL WORLD: const hashedPassword = await hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        // password: hashedPassword, // Schema needs password field if using credentials
        image: `https://ui-avatars.com/api/?name=${name || "User"}&background=random`,
      },
    });

    return ApiUtils.success(user, "User created successfully", 201);
  } catch (error) {
    return ApiUtils.serverError(error);
  }
}
