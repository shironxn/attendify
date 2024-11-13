"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getAttendance() {
  try {
    return await prisma.attendance.findMany({
      include: { student: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch attendance data:", error);
    throw Error("An unexpected error occurred while fetching attendance data.");
  }
}

export async function updateAttendance(
  data: Prisma.AttendanceUpdateInput,
  id: number,
) {
  try {
    await prisma.attendance.update({
      data,
      where: { id },
    });
  } catch (error) {
    console.error("Unexpected error during attendance update:", error);
    throw new Error("An unexpected error occurred while updating attendance.");
  }
}
