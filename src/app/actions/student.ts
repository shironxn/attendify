"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createStudent(data: Prisma.StudentCreateInput) {
  try {
    await prisma.student.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      return { error: error.message };
  }
}
