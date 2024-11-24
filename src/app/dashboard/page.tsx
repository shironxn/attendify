import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getAuth } from "../actions/auth"
import { MonitorSection } from "@/components/dashboard/sections/monitor"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BotIcon, ChartLineIcon, Settings2Icon, SquareTerminalIcon } from "lucide-react"
import Link from "next/link"
import { getAttendance, getAttendanceCount } from "../actions/attendance"
import { StatsSection } from "@/components/dashboard/sections/stats"
import { getStudent } from "../actions/student"
import { ControlSection } from "@/components/dashboard/sections/control"
import { getReader } from "../actions/reader"
import { redirect } from "next/navigation"
import SettingSection from "@/components/dashboard/sections/setting"

const navList = [
  {
    title: "Monitor",
    description: "Lihat aktivitas real-time.",
    icon: <SquareTerminalIcon />,
    url: "monitor"
  },
  {
    title: "Stats",
    description: "Analisis data kehadiran.",
    icon: <ChartLineIcon />,
    url: "stats"
  },
  {
    title: "Control",
    description: "Kelola perangkat dengan mudah.",
    icon: <BotIcon />,
    url: "control"
  },
  {
    title: "Setting",
    description: "Sesuaikan pengaturan sistem.",
    icon: <Settings2Icon />,
    url: "setting"
  }
]


export default async function Dashboard(props: { searchParams?: Promise<{ section?: string }> }) {
  const searchParams = await props.searchParams
  const section = searchParams?.section

  const user = await getAuth()
  const attendance = await getAttendance()
  const chart = await getAttendanceCount()
  const student = await getStudent()
  const reader = await getReader()

  if (!user.data) {
    redirect("/")
  }

  return (
    <SidebarProvider>
      {user.data && <AppSidebar user={user.data} />}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {section &&
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{section.charAt(0).toUpperCase() + section.slice(1)}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {!section &&
            <div className="flex flex-col items-center justify-center space-y-8 mt-24">
              <div className="text-center">
                <h1>Selamat datang {user.data?.name}!</h1>
                <p>Pantau terus kehadiran dengan berbagai fitur Attendify.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                {
                  navList.map((item, index) => (
                    <Link href={`?section=${item.url}`} key={index}>
                      <Card className="hover:scale-105 hover:shadow-xl transition-transform">
                        <CardHeader>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {item.icon}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>}
          {section === "monitor" && <MonitorSection attendance={attendance} />}
          {section === "stats" && <StatsSection data={chart} />}
          {section === "control" && <ControlSection student={student} reader={reader} user={user.data} />}
          {section === "setting" && <SettingSection user={user.data} />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
