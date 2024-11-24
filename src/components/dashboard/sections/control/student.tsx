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
import { Class } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EyeIcon,
  PlusCircleIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  DialogClose,
  DialogContent,
  DialogFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { createStudent, deleteStudent, updateStudent } from "@/app/actions/student";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentCreateSchema, StudentUpdateSchema, StudentCreateForm, StudentUpdateForm } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentWithCard } from "../control";

const inputField = [
  {
    name: "name",
    label: "Name",
    placeholder: "Masukkan nama lengkap Anda"
  },
  {
    name: "class",
    label: "Kelas",
    placeholder: "Misalnya: X1"
  },
  {
    name: "nisn",
    label: "NISN",
    placeholder: "Nomor Induk Siswa Nasional (10 digit)"
  },
  {
    name: "phone_number",
    label: "Nomor Telepon",
    placeholder: "Nomor telepon mulai dengan 62"
  },
  {
    name: "rfid",
    label: "RFID",
    placeholder: "Masukkan ID RFID"
  }
]

export function ControlStudent({ student }: { student: StudentWithCard[] }) {
  const [data, setData] = useState<StudentWithCard[]>(student)
  const [filteredData, setFilteredData] = useState<StudentWithCard[] | undefined>([]);

  const [search, setSearch] = useState("");
  const [kelas, setKelas] = useState<Class | null>(null);

  const [page, setPage] = useState(1);
  const [sizePage, setSizePage] = useState(10);
  const [totalPage, setTotalPage] = useState(10);

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState<StudentWithCard | null>(null);
  const [openEdit, setOpenEdit] = useState<StudentWithCard | null>(null);
  const [openDelete, setOpenDelete] = useState<number | null>(null);

  const formAdd = useForm<StudentCreateForm>({
    resolver: zodResolver(StudentCreateSchema),
    defaultValues: {
      name: "",
      class: "",
      nisn: "",
      phone_number: "",
      rfid: ""
    }
  })

  const formEdit = useForm<StudentUpdateForm>({
    resolver: zodResolver(StudentUpdateSchema),
    defaultValues: {
      id: "",
      name: "",
      class: "",
      nisn: "",
      phone_number: "",
      rfid: ""
    }
  })

  useEffect(() => {
    if (student) {
      setData(student)
      setFilteredData(student)
    }
  }, [student])

  useEffect(() => {
    const applyFiltersAndPagination = () => {
      const start = (page - 1) * sizePage;
      const end = start + sizePage;

      const filtered = data.filter((item) =>
        (!search || item.name.toLowerCase().includes(search.toLowerCase())) &&
        (!kelas || item.class === kelas)
      );

      setFilteredData(filtered.slice(start, end));
      setTotalPage(Math.ceil(filtered.length / sizePage));
    };

    applyFiltersAndPagination();
  }, [data, search, kelas, page, sizePage]);

  useEffect(() => {
    if (openEdit) {
      formEdit.reset({
        id: String(openEdit.id),
        name: openEdit.name,
        nisn: String(openEdit.nisn),
        phone_number: String(openEdit.phone_number), class: openEdit.class,
        rfid: String(openEdit.card?.rfid)
      });
    }
  }, [openEdit, formEdit]);

  async function onSubmit(data: StudentCreateForm | StudentUpdateForm, type: "tambah" | "update") {
    const res = type === "tambah" ? await createStudent(data as StudentCreateForm) : await updateStudent(data as StudentUpdateForm);

    if (res?.error) {
      toast({
        title: "Terjadi Kesalahan",
        description: res.error,
        variant: "destructive"
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
      description: `Berhasil ${type === "tambah" ? "menambahkan" : "memperbarui"} siswa.`
    });
  }

  async function onDelete(id: number) {
    const res = await deleteStudent(id);

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
      description: "Berhasil menghapus siswa."
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Siswa</CardTitle>
          <CardDescription> Kelola data siswa dengan mudah.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-6 gap-4">
            <div className="flex gap-4 col-span-6 md:col-span-2">
              <Input
                placeholder="Cari Siswa"
                onChange={(e) => setSearch(e.target.value)}
              />

              <div>
                <Button size={"icon"} onClick={() => setOpenAdd(true)}><PlusCircleIcon /></Button>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 md:col-start-6">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">Kelas<CaretSortIcon className="h-4 w-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {[...Array(3)].map((_, indexClass) => {
                    const className = indexClass === 0 ? "X" : indexClass === 1 ? "XI" : "XII";
                    return (
                      <DropdownMenuSub key={indexClass}>
                        <DropdownMenuSubTrigger>
                          <span>{className}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {[...Array(8)].map((_, index) => (
                              <DropdownMenuItem
                                key={index}
                                onClick={() => setKelas(`${className}${index + 1}` as Class)}
                              >
                                <span>{index + 1}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    );
                  })}
                  <DropdownMenuItem onClick={() => setKelas(null)}>
                    Semua
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead className="text-right">Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData?.map((item, index) => (
                <ContextMenu key={index}>
                  <ContextMenuTrigger asChild>
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.class}</TableCell>
                      <TableCell className="text-right">
                        {djs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => setOpenView(item)}>
                      Lihat
                      <ContextMenuShortcut>
                        <EyeIcon className="w-4 h-4" />
                      </ContextMenuShortcut>
                    </ContextMenuItem>
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
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Label>Size</Label>
              <Select onValueChange={(e) => setSizePage(Number(e))}>
                <SelectTrigger>
                  <SelectValue placeholder={sizePage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem value={size.toString()} key={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label>
                Page {page} of {totalPage}
              </Label>
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage(1)}
              >
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPage}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
              >
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPage}
                onClick={() => setPage(totalPage)}
              >
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card >

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menambahkan Siswa</DialogTitle>
          </DialogHeader>
          <Form {...formAdd}>
            <form onSubmit={formAdd.handleSubmit(data => onSubmit(data, "tambah"))} className="space-y-4">
              {inputField.map((item, index) => (
                <FormField
                  key={index}
                  control={formAdd.control}
                  name={item.name as keyof StudentCreateForm}
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

      <Dialog open={openView !== null} onOpenChange={() => setOpenView(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Informasi Siswa #{openView?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">Nama</Label>
                <Input
                  id="name"
                  defaultValue={openView?.name}
                  readOnly
                  className="col-span-3 bg-muted"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">NIS</Label>
                <Input
                  id="nis"
                  defaultValue={String(openView?.nisn)}
                  readOnly
                  className="col-span-3 bg-muted"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">Telepon</Label>
                <Input
                  id="phone_number"
                  defaultValue={String(openView?.phone_number)}
                  readOnly
                  className="col-span-3 bg-muted"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">Kelas</Label>
                <Input
                  id="class"
                  defaultValue={openView?.class}
                  readOnly
                  className="col-span-3 bg-muted"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">RFID</Label>
                <Input
                  id="rfid"
                  defaultValue={String(openView?.card?.rfid)}
                  readOnly
                  className="col-span-3 bg-muted"
                />
              </div>

            </section>
          </div>


          <DialogFooter className="gap-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Tutup
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={() => {
                if (openView) {
                  const copyText = `
=== Informasi Siswa ===
- ID: ${openView.id}
- Nama: ${openView.name}
- NIS: ${openView.nisn}
- Telepon: ${openView.phone_number}
- Kelas: ${openView.class}
- RFID: ${openView.card?.rfid}`.trim();
                  navigator.clipboard.writeText(copyText);
                  toast({ description: "Data berhasil disalin!" });
                }
              }}
            >
              Salin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={openEdit !== null} onOpenChange={() => setOpenEdit(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{openEdit?.name} #{openEdit?.id}</SheetTitle>
            <SheetDescription>
              Cek lagi datanya sebelum disimpan, pastikan semuanya sudah sesuai karena perubahan ini bersifat permanen.
            </SheetDescription>
          </SheetHeader>
          <Form {...formEdit}>
            <form onSubmit={formEdit.handleSubmit(data => onSubmit(data, "update"))} className="space-y-4 mt-8">
              {inputField.map((item, index) => (
                <FormField
                  key={index}
                  control={formEdit.control}
                  name={item.name as keyof StudentUpdateForm}
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
            <AlertDialogTitle>Hapus Data Siswa</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah anda yakin ingin menghapus data ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
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
