import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const data = await prisma.card.findUnique({
      where: { rfid: slug },
    });

    return Response.json({ data: data });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
