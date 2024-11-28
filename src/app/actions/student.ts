"use server";

import djs from "@/lib/dayjs";
import { prisma } from "@/lib/prisma";
import { StudentCreateForm, StudentUpdateForm } from "@/lib/types";
import { Class, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createStudent(data: StudentCreateForm) {
  try {
    const student = await prisma.student.create({
      data: {
        name: data.name.toUpperCase(),
        class: data.class as Class,
        nis: BigInt(data.nis),
        phone_number: BigInt(data.phone_number),
      },
    });
    await prisma.card.create({
      data: {
        rfid: BigInt(Number(data.rfid)),
        student: {
          connect: { id: student.id },
        },
      },
    });
  } catch (error) {
    console.error("Error creating student:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return { error: "nis or phone number is already in use." };
        default:
          return { error: error.message };
      }
    }

    return { error: "An unexpected error occurred while creating student." };
  }

  revalidatePath("/dashboard");
}

export async function getStudent() {
  try {
    return await prisma.student.findMany({
      orderBy: { createdAt: "asc" },
      include: { card: true },
    });
  } catch (error) {
    console.error("Error fetching students:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }

    throw new Error(
      "An unexpected error occurred while fetching student data.",
    );
  }
}

export async function getStudentByName(name: string) {
  try {
    const data = await prisma.student.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        attendances: {
          where: {
            createdAt: {
              gte: djs().startOf("day").toDate(),
              lte: djs().endOf("day").toDate(),
            },
          },
        },
      },
    });

    if (data.length === 0) {
      return { error: "Student name not found." };
    }

    return { data };
  } catch (error) {
    console.error("Error fetching student by name:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    return {
      error: "An unexpected error occurred while fetching student data.",
    };
  }
}

export async function updateStudent(data: StudentUpdateForm) {
  try {
    await prisma.student.update({
      data: {
        name: data.name,
        class: data.class as Class,
        nis: BigInt(Number(data.nis)),
        phone_number: BigInt(Number(data.phone_number)),
      },
      where: { id: Number(data.id) },
    });

    if (data.rfid) {
      await prisma.card.update({
        data: { rfid: BigInt(Number(data.rfid)) },
        where: { studentId: Number(data.id) },
      });
    }
  } catch (error) {

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return { error: "Student not found." };
        case "P2002":
          return { error: "nis or phone number is already in use." };
        default:
          return { error: error.message };
      }
    }

    return { error: "An unexpected error occurred while updating student." };
  }

  revalidatePath("/dashboard");
}

export async function deleteStudent(id: number) {
  try {
    await prisma.student.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting student:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return { error: "Student not found." };
        default:
          return { error: error.message };
      }
    }

    return { error: "An unexpected error occurred while deleting student." };
  }

  revalidatePath("/dashboard");
}
