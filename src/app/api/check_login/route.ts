import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const checkLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { data, success } = checkLoginSchema.safeParse(body);
    if (!success) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    const user = await prisma.user.findFirst({
        where: data,
    })
    if (!user) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    return NextResponse.json({}, { status: 200 });
}