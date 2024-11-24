"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ReaderCreateForm, ReaderUpdateForm } from "@/lib/types";
import { Mode, Prisma } from "@prisma/client";

export async function createReader(data: ReaderCreateForm) {
  try {
    await prisma.reader.create({
      data: {
        name: data.name,
        location: data.location,
        user: {
          connect: {
            id: Number(data.user_id),
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred while creating reader." };
  }

  revalidatePath("/dashboard");
}

export async function getReader() {
  try {
    const data = await prisma.reader.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        attendances: true,
        user: true,
      },
    });
    return { data };
  } catch (error) {
    console.error("Failed to fetch readers:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }

    throw new Error("An unexpected error occurred while fetching readers.");
  }
}

export async function getReaderByID(id: number) {
  try {
    const data = await prisma.reader.findUnique({
      where: { id },
      include: { attendances: true, user: true },
    });
    return { data };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }

    throw new Error("An unexpected error occurred while fetching reader data.");
  }
}

export async function updateReader(data: ReaderUpdateForm) {
  try {
    await prisma.reader.update({
      data: {
        name: data.name,
        location: data.location,
        mode: data.mode as Mode,
      },
      where: { id: Number(data.id) },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred while updating reader." };
  }

  revalidatePath("/dashboard");
}

export async function deleteReader(id: number) {
  try {
    await prisma.reader.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred while deleting reader." };
  }

  revalidatePath("/dashboard");
}
