"use client";

import {
  createAttendance,
  deleteAttendance,
  getAttendance,
  updateAttendance,
} from "@/app/actions/attendance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import djs from "@/lib/dayjs";
import { Class, Prisma, Status } from "@prisma/client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EyeIcon,
  LogOutIcon,
  PlusCircleIcon,
  SquarePenIcon,
  Trash2Icon,
  UserRoundCheckIcon,
  UserRoundMinusIcon,
  UserRoundXIcon,
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
  SheetClose,
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
import { Input } from "@/components/ui/input";
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
import { CaretSortIcon } from "@radix-ui/react-icons";
import { AttendanceCraeteForm, AttendanceCreateSchema, AttendanceUpdateForm, AttendanceUpdateSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";

type AttendanceWithStudent = Prisma.AttendanceGetPayload<{
  include: { student: true };
}>;

const cards = [
  {
    title: "Hadir",
    icon: UserRoundCheckIcon,
    content: 0,
  },
  {
    title: "Telat",
    icon: UserRoundMinusIcon,
    content: 0,
  },
  {
    title: "Tidak Hadir",
    icon: UserRoundXIcon,
    content: 0,
  },
  {
    title: "Pulang",
    icon: LogOutIcon,
    content: 0,
  },
];

const statusList: Status[] = [
  "HADIR",
  "TELAT",
  "IZIN",
  "DISPEN",
  "SAKIT",
  "ALFA",
  "PULANG",
];

export function MonitorSection({ attendance }: { attendance: AttendanceWithStudent[] }) {
  const [data, setData] = useState<AttendanceWithStudent[]>(attendance);
  const [filteredData, setFilteredData] = useState<
    AttendanceWithStudent[] | undefined
  >([]);

  const [search, setSearch] = useState("");
  const [kelas, setKelas] = useState<Class | null>(null);
  const [time, setTime] = useState("TODAY");
  const [status, setStatus] = useState("SEMUA");

  const [page, setPage] = useState(1);
  const [sizePage, setSizePage] = useState(10);
  const [totalPage, setTotalPage] = useState(10);

  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState<AttendanceWithStudent | null>(null);
  const [openEdit, setOpenEdit] = useState<AttendanceWithStudent | null>(null);
  const [openDelete, setOpenDelete] = useState<number | null>(null);


  const formAdd = useForm<AttendanceCraeteForm>({
    resolver: zodResolver(AttendanceCreateSchema),
    defaultValues: {
      nisn: "",
      status: "",
      description: "",
    },
  });

  const formEdit = useForm<AttendanceUpdateForm>({
    resolver: zodResolver(AttendanceUpdateSchema),
    defaultValues: {
      id: "",
      status: "",
      description: "",
    },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      getAttendance().then((data) => {
        setData(data);
        setFilteredData(data);

        cards.forEach((item) => (item.content = 0));
        data
          .filter((item) => djs().isSame(item.createdAt, "day"))
          .forEach((item) => {
            switch (item.status) {
              case "HADIR":
                cards[0].content += 1;
                break;
              case "TELAT":
                cards[1].content += 1;
                break;
              case "IZIN":
                cards[2].content += 1;
                break;
              case "DISPEN":
                cards[0].content += 1;
                break;
              case "SAKIT":
                cards[2].content += 1;
                break;
              case "ALFA":
                cards[2].content += 1;
                break;
              case "PULANG":
                cards[3].content += 1;
                break;
              default:
                break;
            }
          });
      });
    }, 1000);

    if (attendance) {
      setData(attendance)
    }

    return () => clearInterval(interval);
  }, [attendance]);

  useEffect(() => {
    const start = (page - 1) * sizePage;
    const end = start + sizePage;

    if (search || time || status) {
      const filteredData = data
        ?.filter((item) =>
          search
            ? item.student.name.toLowerCase().includes(search.toLowerCase())
            : true
        )
        .filter((item) =>
          time === "TODAY" ? djs().isSame(item.createdAt, "day") : true
        )
        .filter((item) => (status !== "SEMUA" ? item.status === status : true))
        .filter((item => kelas ? item.student.class === kelas : true));

      setFilteredData(filteredData.slice(start, end));
      setTotalPage(Math.ceil(filteredData.length / sizePage));
    }
  }, [data, search, kelas, time, status, page, sizePage, totalPage]);

  useEffect(() => {
    if (openEdit) {
      formEdit.reset({
        id: String(openEdit.id),
        status: openEdit.status,
        description: String(openEdit.description) ?? ""
      })
    }
  }, [openEdit, formEdit])


  async function onSubmit(data: AttendanceCraeteForm | AttendanceUpdateForm, type: "tambah" | "update") {
    const res = type === "tambah" ? await createAttendance(data as AttendanceCraeteForm) : await updateAttendance(data as AttendanceUpdateForm)

    if (typeof res === "object" && "error" in res && res.error) {
      toast({
        title: "Error",
        description: res.error,
        variant: "destructive",
      });
      return;
    }

    if (type === "tambah") {
      setOpenAdd(false);
    } else {
      setOpenEdit(null);
    }

    toast({
      title: "Sukses",
      description: `Berhasil ${type} presensi`
    })

  }

  async function onDelete(id: number) {
    const res = await deleteAttendance(id)

    if (res?.error) {
      toast({
        title: "Error",
        description: res.error
      })
      return
    }

    toast({
      title: "Sukses",
      description: "Berhasil menghapus presensi"
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {cards.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              {<item.icon />}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6 md:col-span-2 flex gap-4">
          <Input
            placeholder="Cari Siswa"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div>
            <Button size={"icon"} onClick={() => setOpenAdd(true)}><PlusCircleIcon /></Button>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 md:col-start-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
              {kelas ? kelas : "Kelas"}<CaretSortIcon className="h-4 w-4 opacity-50" />
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

        <div className="col-span-2 md:col-span-1 md:col-start-5">
          <Select onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Hari ini" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODAY">Hari ini</SelectItem>
              <SelectItem value="ALL">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 md:col-span-1 md:col-start-6">
          <Select onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SEMUA">Semua</SelectItem>
              {statusList.map((item, index) => (
                <SelectItem value={item} key={index}>
                  {item.slice(0, 1) + item.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Status</TableHead>
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
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.student.name}</TableCell>
                  <TableCell>{item.student.class}</TableCell>
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

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menambahkan Kehadiran</DialogTitle>
          </DialogHeader>
          <Form {...formAdd}>
            <form onSubmit={formAdd.handleSubmit(data => onSubmit(data, "tambah"))} className="space-y-4">
              <FormField
                control={formAdd.control}
                name="nisn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NISN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan NISN siswa (10 digit)"
                        value={field.value || ""}
                        onChange={e => formAdd.setValue("nisn", e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status siswa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent defaultValue={openEdit?.status}>
                        {Object.values(Status).map((item, index) => (
                          <SelectItem
                            className="col-span-3"
                            defaultValue={openEdit?.status}
                            value={item.valueOf()}
                            key={index}
                          >
                            {item.valueOf()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Siswa hadir, sakit, atau izin"
                        value={field.value || ""}
                        onChange={e => formAdd.setValue("description", e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <DialogTitle>Informasi Siswa #{openView?.student.id}</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            <section className="space-y-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">Nama</Label>
                <Input
                  id="name"
                  defaultValue={openView?.student.name}
                  readOnly
                  className="col-span-3 bg-muted"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">NIS</Label>
                <Input
                  id="nis"
                  defaultValue={String(openView?.student.nisn)}
                  readOnly
                  className="col-span-3 bg-muted"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">Telepon</Label>
                <Input
                  id="phone_number"
                  defaultValue={String(openView?.student.phone_number)}
                  readOnly
                  className="col-span-3 bg-muted"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">Kelas</Label>
                <Input
                  id="class"
                  defaultValue={openView?.student.class}
                  readOnly
                  className="col-span-3 bg-muted"
                />
              </div>
            </section>

            <section className="space-y-4">
              <DialogTitle>Informasi Kehadiran #{openView?.id}</DialogTitle>
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">Status</Label>
                <Input
                  id="status"
                  defaultValue={openView?.status}
                  readOnly
                  className="col-span-3 bg-muted"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-muted-foreground">Keterangan</Label>
                <Input
                  id="description"
                  defaultValue={openView?.description || "-"}
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
- ID: ${openView.student.id}
- Nama: ${openView.student.name}
- NIS: ${openView.student.nisn}
- Telepon: ${openView.student.phone_number}
- Kelas: ${openView.student.class}

=== Informasi Kehadiran ===
- ID: ${openView.id}
- Status: ${openView.status}
- Keterangan: ${openView.description || "-"}
- Waktu: ${djs(openView.createdAt).format("YYYY-MM-DD HH:mm:ss")}
`.trim();
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
            <SheetTitle>{openEdit?.student.name} #{openEdit?.id}</SheetTitle>
            <SheetDescription>
              Cek lagi datanya sebelum disimpan, pastikan semuanya sudah sesuai karena perubahan ini bersifat permanen.
            </SheetDescription>
          </SheetHeader>
          <Form {...formEdit}>
            <form onSubmit={formEdit.handleSubmit(data => onSubmit(data, "update"))} className="space-y-4 mt-8">
              <FormField
                control={formEdit.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={openEdit?.status}
                      value={field.value || openEdit?.status || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={openEdit?.status} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent defaultValue={openEdit?.status}>
                        {Object.values(Status).map((item, index) => (
                          <SelectItem
                            className="col-span-3"
                            defaultValue={openEdit?.status}
                            value={item.valueOf()}
                            key={index}
                          >
                            {item.valueOf()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={formEdit.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value || ""}
                        onChange={e => formEdit.setValue("description", e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Simpan</Button>
                </SheetClose>
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
            <AlertDialogTitle>Hapus Data Kehadiran</AlertDialogTitle>
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
    </div >
  );
}
