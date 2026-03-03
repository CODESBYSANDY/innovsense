import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  return (
    <div>
      <h2>Total: {stats.total}</h2>
      <h3>High: {stats.high}</h3>
      <h3>Medium: {stats.medium}</h3>
      <h3>Low: {stats.low}</h3>
    </div>
  );
}