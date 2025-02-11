"use server"

import { prisma } from "../db";
import { z } from "zod";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export interface SignupSchema {
    email: string;
    password: string;
}
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})
export async function signup(data: SignupSchema) {
    const parsed = signupSchema.parse(data);
    const newUser = await prisma.user.create({
        data: parsed,
    });
    const headersList = await headers();
    const referer = headersList.get('referer') || "http://localhost:3000"
    const refURL = new URL(referer);
    // return NextResponse.redirect(new URL("/login", refURL));
    return;
}

export interface LoginSchema {
    email: string;
    password: string;
}
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})
export async function login(data: LoginSchema) {
    const parsed = loginSchema.parse(data);
    const user = await prisma.user.findFirst({
        where: parsed,
    });
    if (!user) {
        throw new Error(`User with email ${parsed.email} not found.`);
    }
    (await cookies()).set('cred', JSON.stringify(user), { httpOnly: true });
    return;
    // const headersList = await headers();
    // const referer = headersList.get('referer') || "http://localhost:3000"
    // const refURL = new URL(referer);
    // return NextResponse.redirect(new URL("/app", refURL));
}