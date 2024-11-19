"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTransition, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { getStudentByName } from "@/app/actions/student";
import { Student } from "@prisma/client";

export function CariSiswaForm() {
  const [isLoading, startTransition] = useTransition();
  const [students, setStudents] = useState<Student[] | null>(null);
  const { toast } = useToast();

  const form = useForm<{ search: string }>({
    defaultValues: {
      search: "",
    },
  });

  async function onSubmit(data: { search: string }) {
    startTransition(async () => {
      const res = await getStudentByName(data.search);
      if (res?.error) {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
        return;
      }
      if (res?.data) {
        setStudents(res.data);
      }
    });
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cari Siswa</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama siswa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Cari"
            )}
          </Button>
        </form>
      </Form>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-bold">Hasil Pencarian:</h2>
        {students === null && <p>Belum ada pencarian.</p>}
        {students?.length === 0 && <p>Data siswa tidak ditemukan.</p>}
        {students?.map((student) => (
          <div key={student.id} className="p-2 border-b">
            <p><strong>ID:</strong> {student.id}</p>
            <p><strong>Nama:</strong> {student.name}</p>
            <p><strong>Kelas:</strong> {student.class}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

