import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const studentId: number | undefined = 1;

export async function POST(request: Request) {
  try {
    const res = await request.text();

    const data: Prisma.CardCreateInput = {
      rfid: res,
      student: {
        connect: { id: studentId },
      },
    };

    await prisma.card.create({ data });

    return Response.json(
      { message: "Berhasil menambahkan kartu.", data: res },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
