import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_KEY);

export async function signToken(payload) {
  let signed = await  new SignJWT({...payload})
  .setProtectedHeader({alg: "HS256"})
  .setExpirationTime("7d")
  .sign(secret)
  return signed;
}

export async function verifyToken(token) {
  try {
    return (await jwtVerify(token, secret)).payload;
  } catch (e){
    console.error(e)
    return null;
  }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}

export async function getUserFromRequest(req) {
  const cookie = req.headers.get("cookie") || "";
  const tokenMatch = cookie.match(/token=([^;]+)/);
  if (!tokenMatch) return null;
  console.log("found i guesss")
  const token = tokenMatch[1];
  const payload = await verifyToken(token);
  return payload ? payload.userId : null;
}