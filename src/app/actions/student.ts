"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createStudent(data: Prisma.StudentCreateInput) {
  try {
    data.name.toUpperCase();
    await prisma.student.create({ data });
  } catch (error) {
    console.error("Unexpected error in createStudent:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred while creating student." };
  }

  revalidatePath("/dashboard");
}

export async function getStudent() {
  try {
    const data = await prisma.student.findMany();
    return { data };
  } catch (error) {
    console.error("Failed to fetch students:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }

    throw new Error(
      "An unexpected error occurred while fetching student data.",
    );
  }
}

export async function getStudentByID(id: number) {
  try {
    const data = await prisma.student.findUnique({ where: { id } });
    return { data };
  } catch (error) {
    console.error("Failed to fetch student by id:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }

    throw new Error(
      "An unexpected error occurred while fetching student data.",
    );
  }
}

export async function getStudentByName(name: string) {
  try {
    const data = await prisma.student.findMany({ where: { name } });
    return { data };
  } catch (error) {
    console.error("Failed to fetch student by name:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return {
      error: "An unexpected error occurred while fetching student data.",
    };
  }
}

export async function updateStudent(
  data: Prisma.StudentUpdateInput,
  id: number,
) {
  try {
    await prisma.student.update({
      data,
      where: { id },
    });
  } catch (error) {
    console.error("Unexpected error in updateStudent:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred while updating student." };
  }

  revalidatePath("/dashboard");
}

export async function deleteStudent(id: number) {
  try {
    await prisma.student.delete({ where: { id } });
  } catch (error) {
    console.error("Unexpected error in deleteStudent:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred while deleting student." };
  }

  revalidatePath("/dashboard");
}
