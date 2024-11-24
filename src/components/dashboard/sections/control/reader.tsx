"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import djs from "@/lib/dayjs";
import { Mode, Reader, User } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  PlusCircleIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReaderCreateForm, ReaderCreateSchema, ReaderUpdateForm, ReaderUpdateSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReader, deleteReader, updateReader } from "@/app/actions/reader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const inputField = [
  {
    name: "name",
    label: "Nama",
    placeholder: "Masukkan nama perangkat reader"
  },
  {
    name: "location",
    label: "Lokasi",
    placeholder: "Masukkan lokasi pemasangan, misalnya: Lab Komputer"
  },
];

export function ControlReader({ data, user }: { data: Reader[], user: User }) {
  const [filteredData, setFilteredData] = useState<Reader[] | undefined>(data);
  const [mode, setMode] = useState<Mode | string>("")
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState<Reader | null>(null);
  const [openDelete, setOpenDelete] = useState<number | null>(null);

  const formAdd = useForm<ReaderCreateForm>({
    resolver: zodResolver(ReaderCreateSchema),
    defaultValues: {
      user_id: "",
      name: "",
      location: "",
    }
  })

  const formEdit = useForm<ReaderUpdateForm>({
    resolver: zodResolver(ReaderUpdateSchema),
    defaultValues: {
      id: "",
      user_id: "",
      name: "",
      location: "",
      mode: undefined
    }
  })

  useEffect(() => {
    if (mode !== "semua") {
      setFilteredData(data.filter(item => item.mode.includes(mode)))
    }
  }, [mode, data])

  useEffect(() => {
    if (openEdit) {
      formEdit.reset({
        id: String(openEdit.id),
        name: openEdit.name,
        location: openEdit.location,
        mode: openEdit.mode,
      });
    }
  }, [openEdit, formEdit]);

  async function onSubmit(data: ReaderCreateForm | ReaderUpdateForm, type: "tambah" | "update") {
    data.user_id = String(user.id);
    const res = type === "tambah" ? await createReader(data as ReaderCreateForm) : await updateReader(data as ReaderUpdateForm);

    if (res?.error) {
      toast({
        title: "Terjadi Kesalahan",
        description: res.error,
        variant: "destructive",
      });
      return;
    }

    if (type === "tambah") {
      formAdd.reset();
      setOpenAdd(false);
    } else {
      setOpenEdit(null);
    }

    toast({
      title: "Sukses",
      description: `Berhasil ${type === "tambah" ? "menambahkan" : "memperbarui"} reader.`,
    });
  }


  async function onDelete(id: number) {
    const res = await deleteReader(id);

    if (res?.error) {
      toast({
        title: "Terjadi Kesalahan",
        description: res.error,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sukses",
      description: "Berhasil menghapus reader."
    });
  }


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reader</CardTitle>
          <CardDescription>
            Data reader adalah informasi tentang perangkat yang digunakan untuk membaca kartu RFID, termasuk nama dan lokasi pemasangannya.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-4 grid-cols-6">
            <div className="flex gap-4 col-span-6 md:col-span-2">
              <Select onValueChange={setMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  {["ACTIVE", "INACTIVE"].map((item, index) => (
                    <SelectItem value={item} key={index}>
                      {item.slice(0, 1) + item.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                  <SelectItem value="semua">
                    Semua
                  </SelectItem>
                </SelectContent>
              </Select>
              <div>
                <Button
                  onClick={() => {
                    setOpenAdd(true);
                  }}
                  size={"icon"}
                >
                  <PlusCircleIcon />
                </Button>
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead className="text-right">Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                filteredData?.map((item, index) => (
                  <ContextMenu key={index}>
                    <ContextMenuTrigger asChild>
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.mode}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-right">
                          {djs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                        </TableCell>
                      </TableRow>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => setOpenEdit(item)}>
                        Edit
                        <ContextMenuShortcut>
                          <SquarePenIcon className="w-4 h-4" />
                        </ContextMenuShortcut>
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => setOpenDelete(item.id)}>
                        Hapus
                        <ContextMenuShortcut>
                          <Trash2Icon className="w-4 h-4" />
                        </ContextMenuShortcut>
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menambahkan Reader</DialogTitle>
          </DialogHeader>
          <Form {...formAdd}>
            <form
              onSubmit={formAdd.handleSubmit((data) => onSubmit(data, "tambah"))}
              className="space-y-4"
            >
              {inputField.map((item, index) => (
                <FormField
                  key={index}
                  control={formAdd.control}
                  name={item.name as keyof ReaderCreateForm}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input placeholder={item.placeholder} required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <SheetFooter>
                <Button type="submit">Tambah</Button>
              </SheetFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Sheet open={openEdit !== null} onOpenChange={() => setOpenEdit(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>
              {openEdit?.name} #{openEdit?.id}
            </SheetTitle>
            <SheetDescription>
              Cek lagi datanya sebelum disimpan, pastikan semuanya sudah sesuai karena perubahan ini bersifat permanen.
            </SheetDescription>
          </SheetHeader>
          <Form {...formEdit}>
            <form
              onSubmit={formEdit.handleSubmit((data) => onSubmit(data, "update"))}
              className="space-y-4 mt-8"
            >
              {inputField.map((item, index) => (
                <FormField
                  key={index}
                  control={formEdit.control}
                  name={item.name as keyof ReaderUpdateForm}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input placeholder={item.placeholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <SheetFooter>
                <Button type="submit">Simpan</Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={openDelete !== null}
        onOpenChange={() => setOpenDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Reader</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus reader ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
              onClick={() => onDelete(Number(openDelete))}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
