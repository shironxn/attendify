"use server";

import { prisma } from "@/lib/prisma";
import { Login, Register } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import djs from "@/lib/dayjs";
import { compare, hash } from "bcrypt-ts";
import * as jose from "jose";
import { Prisma } from "@prisma/client";

export async function getAuth() {
  try {
    const cookie = await cookies();
    const token = cookie.get("token")?.value;

    if (!token) {
      return { error: "Token not found" };
    }

    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_KEY);
    let payload;
    try {
      ({ payload } = await jose.jwtVerify(token, secret));
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return { error: "Invalid token" };
    }

    const id = Number(payload?.id);
    if (isNaN(id)) {
      return { error: "Invalid token payload" };
    }

    const data = await prisma.user.findUnique({
      where: { id },
    });

    if (!data) {
      return { error: "User not found" };
    }

    return { data };
  } catch (error) {
    console.error("Error in getAuth:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function login(data: Login) {
  try {
    const cookie = await cookies();
    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (!user) {
      return { error: "User not found" };
    }

    const passwordMatch = await compare(data.password, user.password);
    if (!passwordMatch) {
      return { error: "Invalid password" };
    }

    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_KEY);
    const token = await new jose.SignJWT({ id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);

    cookie.set({
      name: "token",
      value: token,
      expires: djs().add(8, "hour").toDate(),
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return {
      error: "An unexpected error occurred during login",
    };
  }

  redirect("/dashboard");
}

export async function register(data: Register) {
  try {
    data.password = await hash(data.password, 10);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "Email is already in use" };
      }
    }

    return { error: "An unexpected error occurred during registration" };
  }

  redirect("/login");
}

export async function logout() {
  try {
    const cookie = await cookies();
    if (!cookie.has("token")) {
      return {
        error: "Token not found",
      };
    }

    cookie.delete("token");
  } catch (error) {
    console.error("Error during logout:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred during logout" };
  }

  redirect("/");
}
