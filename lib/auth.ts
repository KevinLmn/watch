import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const AUTH_COOKIE = "veille_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = Buffer.from(
    `${Date.now()}-${process.env.AUTH_SECRET}`
  ).toString("base64");

  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE);
  return !!token?.value;
}

export function checkPassword(password: string): boolean {
  return password === process.env.AUTH_PASSWORD;
}
