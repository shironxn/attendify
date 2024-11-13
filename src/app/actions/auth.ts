"use server";

import { prisma } from "@/lib/prisma";
import { Login, Register } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import djs from "@/lib/dayjs";
import { compare, hash } from "bcrypt-ts";
import * as jose from "jose";

export async function getAuth() {
  try {
    const cookie = await cookies();
    const token = cookie.get("token")?.value;

    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_KEY);
    const { payload } = await jose.jwtVerify(token!, secret);

    const id = Number(typeof payload === "object" && payload["id"]);
    const data = await prisma.user.findUnique({
      where: { id: id },
    });

    return {
      data,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return {
      error: "An unexpected error occurred",
    };
  }
}

export async function login(data: Login) {
  try {
    const cookie = await cookies();

    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (!user) {
      throw new Error("invalid user");
    }

    const passwordCompare = await compare(data.password, user?.password);
    if (!passwordCompare) {
      throw new Error("invalid user password");
    }

    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_KEY);
    const token = await new jose.SignJWT({ id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    cookie.set({
      name: "token",
      value: token,
      expires: djs().add(1, "hour").toDate(),
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return {
      error: "An unexpected error occurred",
    };
  }

  redirect("/dashboard");
}

export async function register(data: Register) {
  try {
    data.password = await hash(data.password, 10);
    await prisma.user.create({ data });
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return {
      error: "An unexpected error occurred",
    };
  }
  redirect("/login");
}

export async function logout() {
  try {
    const cookie = await cookies();
    if (!cookie.has("token")) {
      return {
        error: "token not foundd",
      };
    }

    cookie.delete("token");
  } catch (error) {
    return {
      error: error,
    };
  }

  redirect("/");
}
