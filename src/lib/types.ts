import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Email harus memiliki format yang valid")
    .min(5, "Email minimal 5 karakter"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(32, "Password maksimal 32 karakter"),
});

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(4, "Nama minimal 4 karakter")
    .max(32, "Nama maksimal 32 karakter")
    .regex(/^[a-zA-Z\s]*$/, "Nama hanya boleh mengandung huruf dan spasi"),
  email: z
    .string()
    .email("Email harus memiliki format yang valid")
    .min(5, "Email minimal 5 karakter"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(32, "Password maksimal 32 karakter")
    .regex(/[A-Z]/, "Password harus mengandung setidaknya satu huruf besar")
    .regex(/[a-z]/, "Password harus mengandung setidaknya satu huruf kecil")
    .regex(/\d/, "Password harus mengandung setidaknya satu angka")
    .regex(
      /[@$!%*?&#]/,
      "Password harus mengandung setidaknya satu simbol khusus",
    ),
});

export const StudentCreateSchema = z.object({
  name: z
    .string()
    .min(4, "Nama siswa minimal 4 karakter")
    .max(64, "Nama siswa maksimal 64 karakter"),
  class: z
    .string()
    .toUpperCase()
    .regex(
      /^(X|XI|XII)[1-8]$/,
      "Kelas harus dimulai dengan X, XI, atau XII diikuti oleh angka 1-8 (contoh: X1, XI3, XII8)",
    )
    .min(1, "Kelas tidak boleh kosong")
    .max(3, "Kelas maksimal 3 karakter"),
  nisn: z
    .string()
    .length(10, "NISN harus memiliki tepat 10 digit")
    .regex(/^\d+$/, "NISN hanya boleh mengandung angka"),
  phone_number: z
    .string()
    .regex(
      /^62\d{8,13}$/,
      "Nomor telepon harus dimulai dengan '62' dan memiliki panjang 10-15 digit",
    ),
  rfid: z
    .string()
    .length(10, "RFID harus memiliki tepat 10 karakter")
    .regex(/^\d+$/, "RFID hanya boleh mengandung angka")
    .optional(),
});

export const StudentUpdateSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .toUpperCase()
    .min(4, "Nama siswa minimal 4 karakter")
    .max(64, "Nama siswa maksimal 64 karakter")
    .optional(),
  class: z
    .string()
    .regex(
      /^(X|XI|XII)[1-8]$/,
      "Kelas harus dimulai dengan X, XI, atau XII diikuti oleh angka 1-8 (contoh: X1, XI3, XII8)",
    )
    .min(1, "Kelas tidak boleh kosong")
    .max(3, "Kelas maksimal 3 karakter")
    .optional(),
  nisn: z
    .string()
    .length(10, "NISN harus memiliki tepat 10 digit")
    .regex(/^\d+$/, "NISN hanya boleh mengandung angka")
    .optional(),
  phone_number: z
    .string()
    .regex(
      /^62\d{8,13}$/,
      "Nomor telepon harus dimulai dengan '62' dan memiliki panjang 10-15 digit",
    )
    .optional(),
  rfid: z
    .string()
    .length(10, "RFID harus memiliki tepat 10 karakter")
    .regex(/^\d+$/, "RFID hanya boleh mengandung angka")
    .optional(),
});

export const ReaderCreateSchema = z.object({
  user_id: z.string().optional(),
  name: z
    .string()
    .min(4, "Nama reader minimal 4 karakter")
    .max(64, "Nama reader maksimal 64 karakter"),
  location: z
    .string()
    .min(4, "Lokasi minimal 4 karakter")
    .max(128, "Lokasi maksimal 128 karakter"),
});

export const ReaderUpdateSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  name: z
    .string()
    .min(4, "Nama reader minimal 4 karakter")
    .max(64, "Nama reader maksimal 64 karakter")
    .optional(),
  location: z
    .string()
    .min(4, "Lokasi minimal 4 karakter")
    .max(128, "Lokasi maksimal 128 karakter")
    .optional(),
  mode: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const AttendanceCreateSchema = z.object({
  nisn: z
    .string()
    .length(10, "NISN harus memiliki tepat 10 digit")
    .regex(/^\d+$/, "NISN hanya boleh mengandung angka"),
  status: z
    .string()
    .min(3, "Status minimal 3 karakter")
    .max(20, "Status maksimal 20 karakter"),
  description: z
    .string()
    .max(255, "Deskripsi maksimal 255 karakter")
    .optional(),
});

export const AttendanceUpdateSchema = z.object({
  id: z.string().optional(),
  status: z
    .string()
    .min(3, "Status minimal 3 karakter")
    .max(20, "Status maksimal 20 karakter")
    .optional(),
  description: z
    .string()
    .max(255, "Deskripsi maksimal 255 karakter")
    .optional(),
});

export const UserUpdateSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .max(32, "Nama maksimal 32 karakter")
    .regex(/^[a-zA-Z\s]*$/, "Nama hanya boleh mengandung huruf dan spasi")
    .optional(),
  email: z.string().email("Email harus memiliki format yang valid").optional(),
});

export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type StudentCreateForm = z.infer<typeof StudentCreateSchema>;
export type StudentUpdateForm = z.infer<typeof StudentUpdateSchema>;
export type ReaderCreateForm = z.infer<typeof ReaderCreateSchema>;
export type ReaderUpdateForm = z.infer<typeof ReaderUpdateSchema>;
export type AttendanceCraeteForm = z.infer<typeof AttendanceCreateSchema>;
export type AttendanceUpdateForm = z.infer<typeof AttendanceUpdateSchema>;
export type UserUpdateForm = z.infer<typeof UserUpdateSchema>;
