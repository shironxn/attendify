"use server";

import djs from "@/lib/dayjs";
import { prisma } from "@/lib/prisma";
import { AttendanceCraeteForm, AttendanceUpdateForm } from "@/lib/types";
import { Prisma, Status } from "@prisma/client";
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

export async function createAttendance(data: AttendanceCraeteForm) {
  try {
    const now = djs();
    const exitTime = now.hour(15);

    const student = await prisma.student.findUnique({
      where: {
        nis: BigInt(data.nis),
      },
    });

    if (!student) {
      return;
    }

    const todaysAttendance = await prisma.attendance.findMany({
      where: {
        studentId: student.id,
        createdAt: {
          gte: now.startOf("day").toDate(),
          lt: now.endOf("day").toDate(),
        },
      },
    });

    const hasCheckedIn = todaysAttendance.some(
      (item) => item.status !== "PULANG",
    );
    const hasCheckedOut = todaysAttendance.some(
      (item) => item.status === "PULANG",
    );

    if (now.isSameOrAfter(exitTime)) {
      if (hasCheckedOut) {
        return Response.json(
          {
            message: `Presensi pulang sudah tercatat untuk ${student.name}.`,
            data: {
              name: student.name,
              status: data.status,
            },
          },
          { status: 409 },
        );
      }
    } else {
      if (hasCheckedIn) {
        return Response.json(
          {
            message: `Presensi sudah tercatat untuk ${student.name}. Tidak dapat melakukan presensi lagi.`,
            data: {
              name: student.name,
              status: data.status,
            },
          },
          { status: 409 },
        );
      }
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId: student?.id,
        status: data.status as Status,
        description: data.description,
      },
    });

    let message;
    switch (data.status) {
      case "HADIR":
        message = `Anak Anda, ${student.name}, telah sampai di SMAN 48 Jakarta dengan selamat pada ${djs(attendance.createdAt).format("LLL")}. Terima kasih.`;
        break;
      case "TELAT":
        message = `Anak Anda, ${student.name}, terlambat datang ke SMAN 48 Jakarta pada ${djs(attendance.createdAt).format("LLL")}. Mohon konfirmasi alasan keterlambatan kepada wali kelas atau pihak sekolah. Terima kasih.`;
        break;
      case "PULANG":
        message = `Anak Anda, ${student.name}, telah meninggalkan SMAN 48 Jakarta dengan selamat pada ${djs(attendance.createdAt).format("LLL")}. Terima kasih.`;
        break;
    }

    await fetch(String(process.env.NEXT_PUBLIC_WHATSAPP_API_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: `${student.phone_number}@c.us`,
        message,
      }),
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

export async function updateAttendance(data: AttendanceUpdateForm) {
  try {
    await prisma.attendance.update({
      data: {
        status: data.status as Status,
        description: data.description,
      },
      where: { id: Number(data.id) },
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
