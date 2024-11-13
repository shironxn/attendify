"use client"

import { getAttendance } from "@/app/actions/attendance"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import djs from "@/lib/dayjs"
import { Prisma, Status } from "@prisma/client"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, UserCheckIcon, UserMinusIcon, UserPenIcon, UserXIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"


type AttendanceWithStudent = Prisma.AttendanceGetPayload<{
  include: { student: true };
}>;

const cards = [
  {
    title: "Hadir",
    icon: UserCheckIcon,
    content: 0
  },
  {
    title: "Telat",
    icon: UserCheckIcon,
    content: 0
  },
  {
    title: "Izin",
    icon: UserCheckIcon,
    content: 0
  },
  {
    title: "Dispen",
    icon: UserCheckIcon,
    content: 0
  },
  {
    title: "Sakit",
    icon: UserMinusIcon,
    content: 0
  },
  {
    title: "Alfa",
    icon: UserXIcon,
    content: 0
  },
  {
    title: "Pulang",
    icon: UserPenIcon,
    content: 0
  },
  {
    title: "Total",
    icon: UserPenIcon,
    content: 0
  },
]

const statusList: Status[] = ["HADIR", "TELAT", "IZIN", "DISPEN", "SAKIT", "ALFA", "PULANG"]

export function MonitorSection() {
  const [data, setData] = useState<AttendanceWithStudent[]>([])
  const [filteredData, setFilteredData] = useState<AttendanceWithStudent[]>([])

  const [search, setSearch] = useState("")
  const [time, setTime] = useState("TODAY")
  const [status, setStatus] = useState("SEMUA")

  const [page, setPage] = useState(1)
  const [sizePage, setSizePage] = useState(10)
  const [totalPage, setTotalPage] = useState(10)

  useEffect(() => {
    const interval = setInterval(() => {
      getAttendance().then(data => {
        setData(data);
        setFilteredData(data);

        cards.forEach(item => item.content = 0)
        data.filter(item => djs().isSame(item.createdAt, "day")).forEach(item => {
          cards[7].content += 1
          switch (item.status) {
            case "HADIR":
              cards[0].content += 1
              break;
            case "TELAT":
              cards[1].content += 1
              break;
            case "IZIN":
              cards[2].content += 1
              break;
            case "DISPEN":
              cards[3].content += 1
              break;
            case "SAKIT":
              cards[4].content += 1
              break;
            case "ALFA":
              cards[5].content += 1
              break;
            case "PULANG":
              cards[6].content += 1
              break;
            default:
              break;
          }
        });
      });
    }, 5000)

    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
    const start = (page - 1) * sizePage
    const end = start + sizePage

    if (search || time || status) {
      const filteredData = data?.
        filter((item) =>
          search ? item.student.name.toLowerCase().includes(search.toLowerCase()) : true
        )
        .filter((item) =>
          time === "TODAY" ? djs().isSame(item.createdAt, "day") : true
        )
        .filter((item) =>
          status !== "SEMUA" ? item.status === status : true
        )

      setFilteredData(filteredData.slice(start, end))
      setTotalPage(Math.ceil(filteredData.length / sizePage))
    }
  }, [data, search, time, status, page, sizePage, totalPage])


  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-rows-4 lg:grid-rows-2 grid-flow-col">
        {cards.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              {<item.icon />}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 grid-cols-6">
        <Input placeholder="Search" className="col-span-4" onChange={e => setSearch(e.target.value)} />
        <Select onValueChange={setTime}>
          <SelectTrigger>
            <SelectValue placeholder="Today" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAY">Today</SelectItem>
            <SelectItem value="ALL">All</SelectItem> </SelectContent>
        </Select>
        <Select onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SEMUA">Semua</SelectItem>
            {statusList.map((item, index) => (
              <SelectItem value={item} key={index}>{item.slice(0, 1) + item.slice(1).toLowerCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead className="text-right">Waktu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData?.map((item, index) => (
            //<ContextMenu key={index}>
            //<ContextMenuTrigger >
            <TableRow key={index}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.student.name}</TableCell>
              <TableCell className="text-right">{djs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
            </TableRow>
            //  </ContextMenuTrigger>
            //  <ContextMenuContent>
            //    <ContextMenuItem>Profile</ContextMenuItem>
            //    <ContextMenuItem>Billing</ContextMenuItem>
            //    <ContextMenuItem>Team</ContextMenuItem>
            //    <ContextMenuItem>Subscription</ContextMenuItem>
            //  </ContextMenuContent>
            //</ContextMenu>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Label>Size</Label>
          <Select onValueChange={e => setSizePage(Number(e))}>
            <SelectTrigger>
              <SelectValue placeholder={sizePage.toString()} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem value={size.toString()} key={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label>Page {page} of {totalPage}</Label>
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(1)}>
            <ChevronsLeftIcon />
          </Button>
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(prev => Math.max(prev - 1, 1))}>
            <ChevronLeftIcon />
          </Button>
          <Button variant="outline" size="icon" disabled={page >= totalPage} onClick={() => setPage(prev => Math.min(prev + 1, totalPage))}>
            <ChevronRightIcon />
          </Button>
          <Button variant="outline" size="icon" disabled={page >= totalPage} onClick={() => setPage(totalPage)}>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>




    </div >
  )
}
