import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import djs from "@/lib/dayjs";

export async function POST(request: Request) {
  try {
    let status: Status = "HADIR";
    const res: { rfid: number; reader_id: number } = await request.json();
    const now = djs();
    const lateTime = now.hour(6).minute(30);
    const exitTime = now.hour(15);

    const card = await prisma.card.findUnique({
      where: { rfid: res.rfid },
      include: { student: true },
    });

    if (!card || !card.student) {
      return Response.json(`Kartu tidak terdaftar, ID: ${res.rfid}`, {
        status: 404,
      });
    }

    const studentName = card.student.name;

    const todaysAttendance = await prisma.attendance.findMany({
      where: {
        studentId: card.studentId,
        readerId: res.reader_id,
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
      status = "PULANG";
      if (hasCheckedOut) {
        return Response.json(
          {
            data: {
              name: studentName,
              status,
            },
          },
          { status: 409 },
        );
      }
      if (!hasCheckedIn) {
        return Response.json(
          {
            data: {
              name: studentName,
              status,
            },
          },
          {
            status: 400,
          },
        );
      }
    } else {
      status = now.isAfter(lateTime) ? "TELAT" : "HADIR";
      if (hasCheckedIn) {
        return Response.json(
          {
            data: {
              name: studentName,
              status,
            },
          },
          {
            status: 409,
          },
        );
      }
    }

    await prisma.attendance.create({
      data: {
        student: {
          connect: { id: card.studentId },
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
      {
        data: {
          name: studentName,
          status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json("Terjadi error!", { status: 500 });
  }
}
