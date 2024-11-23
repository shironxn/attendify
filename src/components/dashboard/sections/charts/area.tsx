"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartData } from "../stats"
import djs from "@/lib/dayjs"

const chartConfig = {
  views: {
    label: "Total",
  },
  hadir: {
    label: "Hadir",
    color: "hsl(var(--chart-1))",
  },
  tidakHadir: {
    label: "Tidak Hadir",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AreaChartComponent({ data }: { data: ChartData }) {
  const [timeRange, setTimeRange] = React.useState("30d")

  const chartData = data.data.map((item) => {
    return {
      date: item.date,
      hadir: item.data.reduce(
        (acc, curr) =>
          ["hadir", "telat"].includes(curr.status) ? acc + curr.count : acc,
        0
      ),
      tidakHadir: item.data.reduce(
        (acc, curr) =>
          ["izin", "sakit", "alfa"].includes(curr.status) ? acc + curr.count : acc,
        0
      ),
    }
  })

  const referenceDate = djs();
  const daysToSubtract = timeRange === "30d" ? 30 : 7;
  const startDate = referenceDate.subtract(daysToSubtract, "day");

  const filteredData = chartData.filter((item) => {
    const itemDate = djs(String(item?.date));
    return itemDate.isSameOrAfter(startDate);
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Visualisasi Kehadiran</CardTitle>
          <CardDescription>
            Menampilkan total kehadiran untuk {timeRange === "30d" ? "30 hari terakhir" : "7 hari terakhir"}.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="30 hari terakhir" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d" className="rounded-lg">
              30 hari terakhir
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 hari terakhir
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillHadir" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-hadir)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-hadir)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTidakHadir" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tidakHadir)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tidakHadir)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("id", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="hadir"
              type="natural"
              fill="url(#fillHadir)"
              stroke="var(--color-hadir)"
              stackId="a"
            />
            <Area
              dataKey="tidakHadir"
              type="natural"
              fill="url(#fillTidakHadir)"
              stroke="var(--color-tidakHadir)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

