import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function ThreatChart({ alerts }) {

  const threatCounts = {};

  alerts.forEach(alert => {
    threatCounts[alert.threat_type] =
      (threatCounts[alert.threat_type] || 0) + 1;
  });

  const data = Object.keys(threatCounts).map(key => ({
    name: key,
    value: threatCounts[key]
  }));

  const COLORS = ["#ff4d4f", "#faad14", "#1890ff", "#52c41a"];

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}