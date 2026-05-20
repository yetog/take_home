import { Stats } from "../types";

interface StatsCardProps {
  stats: Stats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>{stats.total}</h3>
        <p>Total Tasks</p>
      </div>
      <div className="stat-card">
        <h3 style={{ color: "#10b981" }}>{stats.completed}</h3>
        <p>Completed</p>
      </div>
      <div className="stat-card">
        <h3 style={{ color: "#f59e0b" }}>{stats.pending}</h3>
        <p>Pending</p>
      </div>
    </div>
  );
}
