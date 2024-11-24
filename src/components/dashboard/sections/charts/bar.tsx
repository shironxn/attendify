"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
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

export function BarChartComponent({ data }: { data: ChartData }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("hadir")

  const chartData = data.data.map((item) => {
    if (djs().isSameOrBefore(item.date, "week")) {
      return {
        date: item.date,
        hadir: item.data.reduce(
          (acc, curr) =>
            ["hadir", "telat", "dispen"].includes(curr.status) ? acc + curr.count : acc,
          0
        ),
        tidakHadir: item.data.reduce(
          (acc, curr) =>
            ["izin", "sakit", "alfa"].includes(curr.status) ? acc + curr.count : acc,
          0
        ),
      }
    }
  })

  const total = React.useMemo(
    () =>
      chartData.reduce(
        (acc, curr) => ({
          hadir: acc.hadir + (curr?.hadir || 0),
          tidakHadir: acc.tidakHadir + (curr?.tidakHadir || 0),
        }),
        { hadir: 0, tidakHadir: 0 }
      ),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6 text-center sm:text-left">
          <CardTitle>Grafik Kehadiran</CardTitle>
          <CardDescription>
            Data kehadiran siswa selama 7 hari terakhir.
          </CardDescription>
        </div>
        <div className="flex">
          {["hadir", "tidakHadir"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
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
                  weekday: "short"
                })
              }}

            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

