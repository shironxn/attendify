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

export async function getAttendanceCount() {
  try {
    const now = djs();

    const data = await prisma.attendance.groupBy({
      by: ["status", "createdAt"],
      where: {
        createdAt: {
          gte: now.startOf("month").toDate(),
          lt: now.endOf("month").toDate(),
        },
        status: {
          not: "PULANG",
        },
      },
      _count: {
        id: true,
      },
    });

    const groupedData = new Map<string, { status: string; count: number }[]>();

    data.forEach((item) => {
      const date = djs(item.createdAt).format("YYYY-MM-DD");

      if (!groupedData.has(date)) {
        groupedData.set(date, []);
      }

      groupedData.get(date)?.push({
        status: item.status.toLowerCase(),
        count: item._count.id,
      });
    });

    const result = Array.from(groupedData.entries()).map(([date, data]) => {
      const statusCounts = data.reduce(
        (acc: { status: string; count: number }[], curr) => {
          const existing = acc.find((item) => item.status === curr.status);
          if (existing) {
            existing.count += curr.count;
          } else {
            acc.push({ status: curr.status, count: curr.count });
          }
          return acc;
        },
        [],
      );

      return { date, data: statusCounts };
    });

    return { data: result, total: data.length };
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
