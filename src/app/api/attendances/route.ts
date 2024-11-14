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
      return Response.json(
        { message: `Kartu dengan ID: ${res.rfid} tidak terdaftar di sistem.` },
        { status: 404 },
      );
    }

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

    //if (now.isSameOrAfter(exitTime)) {
    //  status = "PULANG";
    //  if (hasCheckedOut) {
    //    return Response.json(
    //      {
    //        message: `Presensi pulang sudah tercatat untuk ${studentName}.`,
    //        data: {
    //          name: studentName,
    //          status,
    //        },
    //      },
    //      { status: 409 },
    //    );
    //  }
    //  if (!hasCheckedIn) {
    //    return Response.json(
    //      {
    //        message: `Presensi masuk belum tercatat untuk ${studentName}. Tidak dapat melakukan presensi pulang.`,
    //        data: {
    //          name: studentName,
    //          status,
    //        },
    //      },
    //      { status: 400 },
    //    );
    //  }
    //} else {
    //  status = now.isAfter(lateTime) ? "TELAT" : "HADIR";
    //  if (hasCheckedIn) {
    //    return Response.json(
    //      {
    //        message: `Presensi sudah tercatat untuk ${studentName}. Tidak dapat melakukan presensi lagi.`,
    //        data: {
    //          name: studentName,
    //          status,
    //        },
    //      },
    //      { status: 409 },
    //    );
    //  }
    //}

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

    //const payload = {
    //  chatId: `${card.student.phone_number}@c.us`,
    //  message: `Anak anda ${card.student.name} sudah ${status.toLowerCase()} sekolah`,
    //};
    //await fetch(String(process.env.NEXT_PUBLIC_WHATSAPP_API_URL), {
    //  method: "POST",
    //  headers: {
    //    "Content-Type": "application/json",
    //  },
    //  body: JSON.stringify(payload),
    //});

    return Response.json(
      {
        message: `Presensi berhasil tercatat untuk ${card.student.name} dengan status ${status.toLowerCase()}.`,
        data: {
          name: card.student.name,
          status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return Response.json(
      { message: "Terjadi kesalahan pada server. Silakan coba lagi nanti." },
      { status: 500 },
    );
  }
}
