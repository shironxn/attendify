import { prisma } from "@/lib/prisma";

export async function GET(_: Request, {params}: {params: {slug: number}}) {
  try {
    const data = await prisma.card.findUnique({
      where: {id: params.slug}
    })

    return Response.json({ data: data });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
