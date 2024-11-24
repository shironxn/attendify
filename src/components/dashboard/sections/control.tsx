"use client";

import { Prisma, Reader, User } from "@prisma/client";
import { ControlStudent } from "./control/student";
import { ControlReader } from "./control/reader";

export type StudentWithCard = Prisma.StudentGetPayload<{
  include: {
    card: true;
  };
}>;

export function ControlSection({ student, reader, user }: { student: StudentWithCard[], reader: Reader[], user: User }) {
  return (
    <div className="grid gap-4">
      <ControlStudent student={student} />
      <ControlReader data={reader} user={user} />
    </div>
  );
}

