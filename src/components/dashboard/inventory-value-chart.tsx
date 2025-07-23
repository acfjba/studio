
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from 'next-themes';

const inventoryChartData = [
  { "name": "Laptops", "value": 40000 },
  { "name": "Projectors", "value": 5250 },
  { "name": "Textbooks", "value": 11250 },
  { "name": "Markers", "value": 200 },
  { "name": "Lab Coats", "value": 1000 },
  { "name": "Microscopes", "value": 9600 },
  { "name": "Soccer Balls", "value": 600 }
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function InventoryValueChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}
        />
        <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
        <Pie
          data={inventoryChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          stroke={isDark ? 'hsl(var(--background))' : 'hsl(var(--card))'}
        >
          {inventoryChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
