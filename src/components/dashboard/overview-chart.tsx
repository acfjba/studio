
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const overviewChartData = [
  { name: 'Jan', total: 1100 },
  { name: 'Feb', total: 2300 },
  { name: 'Mar', total: 1800 },
  { name: 'Apr', total: 3200 },
  { name: 'May', total: 2500 },
  { name: 'Jun', total: 4100 },
  { name: 'Jul', total: 3800 },
  { name: 'Aug', total: 4500 },
  { name: 'Sep', total: 3900 },
  { name: 'Oct', total: 4800 },
  { name: 'Nov', total: 5200 },
  { name: 'Dec', total: 5500 }
];

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={overviewChartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
