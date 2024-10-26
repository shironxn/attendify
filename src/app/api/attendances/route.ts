import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import djs from "@/lib/dayjs";

export async function POST(request: Request) {
  try {
    let status: Status = "HADIR";
    const res = await request.json();
    const now = djs();
    const lateTime = now.hour(6).minute(30);
    const exitTime = now.hour(17);

    const todaysAttendance = await prisma.attendance.findMany({
      where: {
        student: { id: res.student_id },
        reader: { id: res.reader_id },
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

    if (now.isAfter(exitTime)) {
      if (hasCheckedOut) {
        return Response.json(
          { error: "Anda sudah melakukan presensi pulang hari ini." },
          { status: 400 },
        );
      }
      if (!hasCheckedIn) {
        return Response.json(
          { error: "Anda belum melakukan presensi masuk hari ini." },
          { status: 400 },
        );
      }
      status = "PULANG";
    } else {
      if (hasCheckedIn) {
        return Response.json(
          { error: "Anda sudah melakukan presensi masuk hari ini." },
          { status: 400 },
        );
      }
      status = now.isAfter(lateTime) ? "TELAT" : "HADIR";
    }

    const data = await prisma.attendance.create({
      data: {
        student: {
          connect: { id: res.student_id },
        },
        reader: {
          connect: { id: res.reader_id },
        },
        status: status,
      },
      include: {
        student: true,
      },
    });

    return Response.json(
      { message: "Berhasil melakukan presensi.", data },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
