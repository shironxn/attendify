"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ReaderCreateForm, ReaderUpdateForm } from "@/lib/types";
import { Mode, Prisma } from "@prisma/client";

export async function createReader(data: ReaderCreateForm) {
  try {
    await prisma.reader.create({
      data: {
        name: data.name.toUpperCase(),
        location: data.location,
        user: {
          connect: { id: Number(data.user_id) },
        },
      },
    });
  } catch (error) {
    console.error("Error creating reader:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return { error: "Reader name already exists." };
        case "P2025":
          return { error: "User not found." };
        default:
          return { error: error.message };
      }
    }

    return { error: "An unexpected error occurred while creating the reader." };
  }

  revalidatePath("/dashboard");
}

export async function getReader() {
  try {
    return await prisma.reader.findMany({
      orderBy: { createdAt: "asc" },
      include: { attendances: true, user: true },
    });
  } catch (error) {
    console.error("Error fetching readers:", error);
    throw new Error("An unexpected error occurred while fetching readers.");
  }
}

export async function updateReader(data: ReaderUpdateForm) {
  try {
    await prisma.reader.update({
      data: {
        name: String(data.name).toUpperCase(),
        location: data.location,
        mode: data.mode as Mode,
      },
      where: { id: Number(data.id) },
    });
  } catch (error) {
    console.error("Error updating reader:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return { error: "Reader not found." };
        case "P2002":
          return { error: "Reader name already exists." };
        default:
          return { error: error.message };
      }
    }

    return { error: "An unexpected error occurred while updating the reader." };
  }

  revalidatePath("/dashboard");
}

export async function deleteReader(id: number) {
  try {
    await prisma.reader.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting reader:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return { error: "Reader not found." };
        default:
          return { error: error.message };
      }
    }

    return { error: "An unexpected error occurred while deleting the reader." };
  }

  revalidatePath("/dashboard");
}
