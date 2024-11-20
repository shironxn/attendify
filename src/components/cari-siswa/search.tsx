"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTransition, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { getStudentByName } from "@/app/actions/student";
import { Prisma } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { EyeIcon, SearchIcon } from "lucide-react";
import djs from "@/lib/dayjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


type StudentWithAttendance = Prisma.StudentGetPayload<{
  include: { attendances: true };
}>;

export function CariSiswaForm() {
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const [students, setStudents] = useState<StudentWithAttendance[] | null>(null);
  const [openView, setOpenView] = useState<StudentWithAttendance | null>(null);


  const form = useForm<{ search: string }>({
    defaultValues: {
      search: "",
    }
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
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Masukkan nama siswa" {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} size="icon">
            {isLoading ? (
              <ReloadIcon className="animate-spin" />
            ) : (
              <SearchIcon />

            )}
          </Button>
        </form>
      </Form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kelas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.class}</TableCell>
              <TableCell className="flex justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" onClick={() => item.attendances.length !== 0 ? setOpenView(item) : toast({ title: "Error", description: "Belum ada data kehadiran", variant: "destructive" })}>
                        <EyeIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Lihat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openView !== null} onOpenChange={() => setOpenView(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Informasi Kehadiran</DialogTitle>
          </DialogHeader>

          <section className="space-y-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <Label className="text-muted-foreground">Nama</Label>
              <Input
                id="nama"
                defaultValue={openView?.name}
                readOnly
                className="col-span-3 bg-muted"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label className="text-muted-foreground">Status</Label>
              <Input
                id="status"
                defaultValue={openView?.attendances[0].status}
                readOnly
                className="col-span-3 bg-muted"
              />
            </div>
            <div className="grid grid-cols-4 gap-4 items-center">
              <Label className="text-muted-foreground">Keterangan</Label>
              <Input
                id="description"
                defaultValue={openView?.attendances[0].description || "-"}
                readOnly
                className="col-span-3 bg-muted focus:ring-0"
              />
            </div>
            <div className="grid grid-cols-4 gap-4 items-center">
              <Label className="text-muted-foreground">Waktu</Label>
              <Input
                id="created_at"
                defaultValue={djs(openView?.createdAt).format(
                  "LLL"
                )}
                readOnly
                className="col-span-3 bg-muted"
              />
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </div>
  );
}

