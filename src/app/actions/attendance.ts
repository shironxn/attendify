"use server";

import djs from "@/lib/dayjs";
import { prisma } from "@/lib/prisma";
import { Attendance, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAttendance() {
  try {
    return await prisma.attendance.findMany({
      include: { student: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Unexpected error in getAttendance:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }

    throw new Error(
      "An unexpected error occurred while fetching attendance data.",
    );
  }
}

export async function createAttendance(data: Prisma.AttendanceCreateInput) {
  try {
    await prisma.attendance.create({
      data,
    });
  } catch (error) {
    console.error("Unexpected error in createAttendance:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred while creating attendance." };
  }

  revalidatePath("/dashboard");
}

export async function updateAttendance(data: Attendance) {
  console.log(data);
  try {
    await prisma.attendance.update({
      data: {
        status: data.status,
        description: data.description,
      },
      where: { id: data.id },
    });
  } catch (error) {
    console.error("Unexpected error in updateAttendance:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred while updating attendance." };
  }

  revalidatePath("/dashboard");
}

export async function deleteAttendance(id: number) {
  try {
    await prisma.attendance.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Unexpected error in deleteAttendance:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return { error: "An unexpected error occurred while deleting attendance." };
  }

  revalidatePath("/dashboard");
}
