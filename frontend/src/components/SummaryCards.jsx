export default function SummaryCards({ alerts }) {

  const total = alerts.length;
  const high = alerts.filter(a => a.risk_level === "High").length;
  const medium = alerts.filter(a => a.risk_level === "Medium").length;
  const low = alerts.filter(a => a.risk_level === "Low").length;

  return (
    <div className="summary-container">
      <div className="card">Total Alerts: {total}</div>
      <div className="card high">High Risk: {high}</div>
      <div className="card medium">Medium Risk: {medium}</div>
      <div className="card low">Low Risk: {low}</div>
    </div>
  );
}