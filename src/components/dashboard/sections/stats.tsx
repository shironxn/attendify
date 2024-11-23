"use client";

import { PieChartComponent } from "./charts/pie";
import { AreaChartComponent } from "./charts/area";
import { BarChartComponent } from "./charts/bar";

export type ChartData = {
  data: Array<{
    date: string;
    data: Array<{ status: string, count: number }>
  }>;
  total: number;
};


export function StatsSection({ data }: { data: ChartData }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <PieChartComponent data={data} />
      <BarChartComponent data={data} />
      <div className="col-span-1 lg:col-span-2">
        <AreaChartComponent data={data} />
      </div>
    </div>
  );
}

