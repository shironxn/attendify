"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createStudent(data: Prisma.StudentCreateInput) {
  try {
    await prisma.student.create({ data });
  } catch (error) {
    console.error("Unexpected error in createStudent:", error);
    throw new Error("An unexpected error occurred while creating student.");
  }
}

export async function getStudent() {
  try {
    const data = await prisma.student.findMany();
    return { data };
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw Error("An unexpected error occurred while fetching student data.");
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
    throw new Error("An unexpected error occurred while updating student.");
  }
}

export async function deleteStudent(id: number) {
  try {
    await prisma.student.delete({ where: { id } });
  } catch (error) {
    console.error("Unexpected error in deleteStudent:", error);
    throw new Error("An unexpected error occurred while deleting student.");
  }
}
