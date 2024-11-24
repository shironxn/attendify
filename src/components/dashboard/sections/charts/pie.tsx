"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartData } from "../stats"
import djs from "@/lib/dayjs"

const chartData = [
  { status: "hadir", count: 0, fill: "var(--color-hadir)" },
  { status: "telat", count: 0, fill: "var(--color-telat)" },
  { status: "izin", count: 0, fill: "var(--color-izin)" },
  { status: "dispen", count: 0, fill: "var(--color-dispen)" },
  { status: "sakit", count: 0, fill: "var(--color-sakit)" },
  { status: "alfa", count: 0, fill: "var(--color-alfa)" },
]

const chartConfig = {
  status: {
    label: "Status",
  },
  hadir: {
    label: "Hadir",
    color: "hsl(var(--chart-1))",
  },
  telat: {
    label: "Telat",
    color: "hsl(var(--chart-2))",
  },
  izin: {
    label: "Izin",
    color: "hsl(var(--chart-3))",
  },
  dispen: {
    label: "Dispen",
    color: "hsl(var(--chart-4))",
  },
  sakit: {
    label: "Sakit",
    color: "hsl(var(--chart-5))",
  },
  alfa: {
    label: "Alfa",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig

export function PieChartComponent({ data }: { data: ChartData }) {
  type StatusCounts = {
    hadir: number;
    telat: number;
    izin: number;
    dispen: number;
    sakit: number;
    alfa: number;
  }

  const statusCounts: StatusCounts = {
    hadir: 0,
    telat: 0,
    izin: 0,
    dispen: 0,
    sakit: 0,
    alfa: 0,
  }

  data.data.forEach((element) => {
    element.data.forEach((statusElement) => {
      if (statusElement.status in statusCounts) {
        statusCounts[statusElement.status as keyof StatusCounts] += statusElement.count
      }
    })
  })

  chartData.forEach((chart) => {
    chart.count = statusCounts[chart.status as keyof StatusCounts]
  })

  const totalHadir = data.data.reduce((acc, item) => {
    return (
      acc +
      item.data.reduce((subAcc, curr) => {
        if (["hadir", "telat", "dispen"].includes(curr.status) && typeof curr.count === "number") {
          return subAcc + curr.count;
        }
        return subAcc;
      }, 0)
    );
  }, 0);
  const percentage = (data.total > 0 ? (totalHadir / data.total) * 100 : 0).toFixed(2);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Persentase Data Presensi</CardTitle>
        <CardDescription>{djs().format("MMMM")} - {djs().format("YYYY")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data.total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Data
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {percentage}% Kehadiran <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total persentase data kehadiran berdasarkan bulan {djs().format("MMMM YYYY")}.</div>
      </CardFooter>
    </Card>
  )
}

