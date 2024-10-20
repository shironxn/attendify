import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const res: Prisma.AttendanceCreateInput = await request.json();

    const data: Prisma.AttendanceCreateInput = {
      student: res.student,
      reader: res.reader,
    };

    await prisma.attendance.create({ data });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
