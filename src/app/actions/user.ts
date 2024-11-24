"use server";

import { prisma } from "@/lib/prisma";
import { UserUpdateForm } from "@/lib/types";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUser(data: UserUpdateForm) {
  try {
    await prisma.user.update({
      data: {
        name: data.name,
        email: data.email,
      },
      where: { id: Number(data.id) },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "The email address is already in use." };
      }
      return { error: `Database error: ${error.message}` };
    }

    if (error instanceof TypeError) {
      return { error: "Invalid data format. Please check the input values." };
    }

    return { error: "An unexpected error occurred. Please try again later." };
  }
}
