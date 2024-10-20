import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const res: number = await request.json();

  try {
    await prisma.card.create({
      data: {
        rfid: res,
      },
    });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }

  return Response.json({ data: res });
}
