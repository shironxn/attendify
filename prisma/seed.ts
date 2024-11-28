import { PrismaClient, Status, Mode, Class } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "shironxn",
      email: "shironxn@gmail.com",
      password: "Attendify#1",
    },
  });

  const reader = await prisma.reader.create({
    data: {
      name: "GERBANG MASUK",
      location: "GERBANG UTAMA",
      mode: Mode.ACTIVE,
      userId: user.id,
    },
  });

  const allen = await prisma.student.create({
    data: {
      name: "ALLEN AHMAD TAQY",
      nis: 21001,
      phone_number: 6281234567890,
      class: Class.XI5,
    },
  });

  const mutia = await prisma.student.create({
    data: {
      name: "MUTIA CAHYANITA",
      nis: 21002,
      phone_number: 6281234567891,
      class: Class.XI5,
    },
  });

  await prisma.card.create({
    data: {
      rfid: 12345678901,
      studentId: allen.id,
    },
  });

  await prisma.card.create({
    data: {
      rfid: 12345678902,
      studentId: mutia.id,
    },
  });

  const today = dayjs().startOf("day");
  const statuses = [
    Status.HADIR,
    Status.TELAT,
    Status.SAKIT,
    Status.IZIN,
    Status.DISPEN,
  ];
  const descriptions = {
    HADIR: "Hadir tepat waktu.",
    TELAT: "Datang terlambat.",
    SAKIT: "Tidak masuk karena sakit.",
    IZIN: "Izin untuk tidak hadir.",
    DISPEN: "Dispensasi kegiatan lain.",
  };

  for (let i = 0; i < 7; i++) {
    const currentDate = today.subtract(i, "day").toDate();

    for (const student of [allen, mutia]) {
      const status =
        i % 2 === 0
          ? Status.HADIR
          : statuses[Math.floor(Math.random() * statuses.length)];
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          readerId: reader.id,
          status: status,
          description: descriptions[status],
          createdAt: currentDate,
        },
      });
    }
  }

  console.log("Seed data dengan 7 hari penuh berhasil dibuat!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
