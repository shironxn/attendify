import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const data = await prisma.card.findUnique({
      where: { rfid: params.slug },
    });

    return Response.json({ data: data });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
