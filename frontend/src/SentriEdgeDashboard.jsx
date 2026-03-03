import { useState, useEffect, useCallback } from "react";
const BASE_URL = "http://127.0.0.1:8000";
const ALERT_TYPES = [
  "Rapid File Modification Detected",
  "Unusual Outbound Traffic Spike",
  "Port Scan Activity Observed",
  "Unauthorized SSH Login Attempt",
  "DNS Tunneling Pattern Detected",
  "Brute Force Attack - RDP",
  "Suspicious Process Spawned",
  "Large Data Exfiltration Attempt",
  "ARP Spoofing Detected",
  "Ransomware-like Behavior Flagged",
];

const DEVICES = [
  { id: "RPI-001", name: "Edge Node Alpha", location: "Main Office LAN" },
  { id: "RPI-002", name: "Edge Node Beta", location: "Server Room" },
  { id: "RPI-003", name: "Edge Node Gamma", location: "Branch Network" },
];

const RISK_CONFIG = {
  High: { color: "#ff3b5c", bg: "rgba(255,59,92,0.12)" },
  Medium: { color: "#f5a623", bg: "rgba(245,166,35,0.12)" },
  Low: { color: "#00e5a0", bg: "rgba(0,229,160,0.12)" },
};

function generateAlert(id) {
  const risks = ["High", "Medium", "Medium", "Low", "Low"];
  const risk = risks[Math.floor(Math.random() * risks.length)];
  const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
  const type = ALERT_TYPES[Math.floor(Math.random() * ALERT_TYPES.length)];

  return {
    id,
    type,
    risk,
    device: device.id,
    deviceName: device.name,
    location: device.location,
    timestamp: new Date(),
    ip: `192.168.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 254) + 1}`,
    acknowledged: false,
  };
}

const initialAlerts = Array.from({ length: 12 }, (_, i) => {
  const a = generateAlert(i + 1);
  a.timestamp = new Date(Date.now() - (12 - i) * 4 * 60000);
  return a;
});

function SparkLine({ data, color }) {
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 90}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "48px" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <polygon points={`0,100 ${points} 100,100`} fill={`url(#grad-${color.replace("#", "")})`} />
    </svg>
  );
}

function RiskBadge({ risk }) {
  const cfg = RISK_CONFIG[risk];

  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}40`,
        borderRadius: "4px",
        padding: "2px 10px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.color,
          boxShadow: `0 0 6px ${cfg.color}`,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {risk}
    </span>
  );
}

function StatCard({ label, value, sub, color, sparkData }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        padding: "20px 22px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ fontSize: "11px", color: "#6b7a99", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: "32px", fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: "11px", color: "#4a5568" }}>{sub}</div>
      <div style={{ marginTop: "8px", opacity: 0.7 }}>
        <SparkLine data={sparkData} color={color} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60px",
          height: "60px",
          background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
          borderRadius: "0 12px 0 60px",
        }}
      />
    </div>
  );
}

function DeviceStatus({ device, alertCount, isOnline }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px",
        marginBottom: "8px",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "8px",
            background: isOnline ? "rgba(0,229,160,0.1)" : "rgba(107,119,153,0.1)",
            border: `1px solid ${isOnline ? "#00e5a040" : "#6b7a9940"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}
        >
          D
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: isOnline ? "#00e5a0" : "#4a5568",
            border: "2px solid #0d1117",
            boxShadow: isOnline ? "0 0 8px #00e5a0" : "none",
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {device.name}
        </div>
        <div style={{ fontSize: "11px", color: "#4a5568" }}>
          {device.id} - {device.location}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: alertCount > 3 ? "#ff3b5c" : alertCount > 1 ? "#f5a623" : "#00e5a0" }}>
          {alertCount}
        </div>
        <div style={{ fontSize: "10px", color: "#4a5568" }}>alerts</div>
      </div>
    </div>
  );
}

export default function SentriEdgeDashboard() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState("All");
  const [nextId, setNextId] = useState(initialAlerts.length + 1);
  const [lastAlertTime, setLastAlertTime] = useState(null);
  const [liveMode, setLiveMode] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [sparkHistory] = useState({
    total: [2, 4, 3, 7, 5, 9, 6, 11, 8, 12, 10, 14],
    high: [0, 1, 0, 2, 1, 3, 2, 4, 2, 5, 3, 4],
    medium: [1, 2, 2, 3, 2, 4, 3, 5, 4, 5, 4, 7],
    low: [1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 3, 3],
  });
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [resolvedIds, setResolvedIds] = useState([]);
  const [escalatedIds, setEscalatedIds] = useState([]);

  const addAlert = useCallback(() => {
    setNextId((prev) => {
      const newAlert = generateAlert(prev);
      setAlerts((a) => [newAlert, ...a].slice(0, 50));
      setLastAlertTime(new Date());
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (!liveMode) return undefined;
    const interval = setInterval(addAlert, 4500 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [liveMode, addAlert]);
  // ===== AUTO ESCALATION CHECK =====
useEffect(() => {
  const interval = setInterval(() => {
    alerts.forEach((a) => {
      if (
        a.risk === "High" &&
        !a.acknowledged &&
        !escalatedIds.includes(a.id)
      ) {
        setEscalatedIds((prev) => [...prev, a.id]);

        fetch(`${BASE_URL}/alerts/escalate/${a.id}`, {
          method: "PUT",
        }).catch(() => {});
      }
    });
  }, 8000);

  return () => clearInterval(interval);
}, [alerts, escalatedIds]);

  const filtered = filter === "All" ? alerts : alerts.filter((a) => a.risk === filter);
  const highCount = alerts.filter((a) => a.risk === "High").length;
  const medCount = alerts.filter((a) => a.risk === "Medium").length;
  const lowCount = alerts.filter((a) => a.risk === "Low").length;

  const deviceAlertCounts = DEVICES.reduce((acc, d) => {
    acc[d.id] = alerts.filter((a) => a.device === d.id).length;
    return acc;
  }, {});

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c14",
        color: "#c9d1e0",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2a3a; border-radius: 4px; }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .alert-row { animation: slide-in 0.3s ease; }
        .alert-row:hover { background: rgba(255,255,255,0.04) !important; cursor: pointer; }
        .filter-btn { transition: all 0.2s ease; }
        .filter-btn:hover { opacity: 0.85; }
        .ack-btn { transition: all 0.15s; }
        .ack-btn:hover { filter: brightness(1.2); }
      `}</style>

      <div
        style={{
          padding: "0 28px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(8,12,20,0.95)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #0066ff, #00e5a0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              boxShadow: "0 0 20px rgba(0,102,255,0.4)",
            }}
          >
            S
          </div>
          <div style={{ letterSpacing: "-0.02em" }}>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#e2e8f0" }}>
              SentriEdge <span style={{ color: "#0066ff" }}>AI</span>
            </div>
            <div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Hybrid Edge Cybersecurity
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ position: "relative", width: 8, height: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: liveMode ? "#00e5a0" : "#4a5568",
                  boxShadow: liveMode ? "0 0 10px #00e5a0" : "none",
                }}
              />
              {liveMode && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "#00e5a0",
                    animation: "pulse-ring 1.5s ease-out infinite",
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: "11px", color: liveMode ? "#00e5a0" : "#4a5568", fontFamily: "JetBrains Mono", fontWeight: 600 }}>
              {liveMode ? "LIVE" : "PAUSED"}
            </span>
          </div>

          <button
            onClick={() => setLiveMode((m) => !m)}
            style={{
              background: liveMode ? "rgba(255,59,92,0.1)" : "rgba(0,229,160,0.1)",
              border: `1px solid ${liveMode ? "#ff3b5c40" : "#00e5a040"}`,
              color: liveMode ? "#ff3b5c" : "#00e5a0",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {liveMode ? "Pause" : "Resume"}
          </button>

          <button
            onClick={addAlert}
            style={{
              background: "rgba(0,102,255,0.1)",
              border: "1px solid rgba(0,102,255,0.3)",
              color: "#4d94ff",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            + Simulate Alert
          </button>

          <div style={{ fontSize: "11px", color: "#4a5568", fontFamily: "JetBrains Mono" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, gap: 0, overflow: "hidden" }}>
        <div
          style={{
            width: "240px",
            flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            overflowY: "auto",
          }}
        >
          <div>
            <div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "12px" }}>
              Edge Devices
            </div>
            {DEVICES.map((d) => (
              <DeviceStatus key={d.id} device={d} alertCount={deviceAlertCounts[d.id] || 0} isOnline />
            ))}
          </div>

          <div>
            <div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "12px" }}>
              Threat Breakdown
            </div>
            {["High", "Medium", "Low"].map((r) => {
              const count = alerts.filter((a) => a.risk === r).length;
              const pct = Math.round((count / Math.max(alerts.length, 1)) * 100);
              const cfg = RISK_CONFIG[r];

              return (
                <div key={r} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", color: cfg.color, fontWeight: 600 }}>{r}</span>
                    <span style={{ fontSize: "11px", color: "#4a5568", fontFamily: "JetBrains Mono" }}>{count}</span>
                  </div>
                  <div style={{ height: "4px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: "4px",
                        background: cfg.color,
                        boxShadow: `0 0 8px ${cfg.color}60`,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "12px" }}>
              System Status
            </div>
            {[
              { label: "FastAPI Backend", status: "Operational", ok: true },
              { label: "Edge Processing", status: "Active", ok: true },
              { label: "DB Sync", status: "Synced", ok: true },
              { label: "AI Anomaly Engine", status: "Running", ok: true },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", color: "#6b7a99" }}>{s.label}</span>
                <span style={{ fontSize: "10px", color: s.ok ? "#00e5a0" : "#ff3b5c", fontWeight: 600 }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          {lastAlertTime && (
            <div
              style={{
                padding: "10px 12px",
                background: "rgba(0,102,255,0.06)",
                border: "1px solid rgba(0,102,255,0.15)",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "10px", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                Last Received
              </div>
              <div style={{ fontSize: "12px", color: "#4d94ff", fontFamily: "JetBrains Mono" }}>{formatTime(lastAlertTime)}</div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            <StatCard
              label="Total Alerts"
              value={alerts.length}
              sub={`+${alerts.filter((a) => (Date.now() - a.timestamp) / 60000 < 30).length} last 30 min`}
              color="#4d94ff"
              sparkData={sparkHistory.total}
            />
            <StatCard label="High Risk" value={highCount} sub="Immediate attention" color="#ff3b5c" sparkData={sparkHistory.high} />
            <StatCard label="Medium Risk" value={medCount} sub="Review recommended" color="#f5a623" sparkData={sparkHistory.medium} />
            <StatCard label="Low Risk" value={lowCount} sub="Monitor ongoing" color="#00e5a0" sparkData={sparkHistory.low} />
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden" }}>
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0" }}>
                Security Alerts
                <span style={{ marginLeft: "10px", fontSize: "11px", fontWeight: 500, color: "#4a5568", fontFamily: "JetBrains Mono" }}>
                  ({filtered.length})
                </span>
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                {["All", "High", "Medium", "Low"].map((f) => (
                  <button
                    key={f}
                    className="filter-btn"
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "4px 14px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: filter === f ? `1px solid ${f === "All" ? "#4d94ff" : RISK_CONFIG[f].color}60` : "1px solid rgba(255,255,255,0.06)",
                      background: filter === f ? (f === "All" ? "rgba(77,148,255,0.12)" : RISK_CONFIG[f].bg) : "transparent",
                      color: filter === f ? (f === "All" ? "#4d94ff" : RISK_CONFIG[f].color) : "#4a5568",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 140px 130px 90px 80px",
                padding: "8px 20px",
                fontSize: "10px",
                color: "#4a5568",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span>Alert Type</span>
              <span>Risk</span>
              <span>Device</span>
              <span>Source IP</span>
              <span>Time</span>
              <span style={{ textAlign: "right" }}>Action</span>
            </div>

            <div style={{ maxHeight: "420px", overflowY: "auto" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#4a5568" }}>No alerts for this filter</div>
              ) : (
                filtered.map((alert, idx) => (
                  <div
                    key={alert.id}
                    className="alert-row"
                    onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 120px 140px 130px 90px 80px",
                      padding: "12px 20px",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      background: selectedAlert?.id === alert.id ? "rgba(77,148,255,0.05)" : idx === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      alignItems: "center",
                      transition: "background 0.15s",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {idx === 0 && (
                          <span
                            style={{
                              fontSize: "9px",
                              color: "#ff3b5c",
                              fontWeight: 700,
                              background: "rgba(255,59,92,0.1)",
                              border: "1px solid #ff3b5c40",
                              borderRadius: "3px",
                              padding: "1px 5px",
                              flexShrink: 0,
                              animation: "blink 1.5s ease infinite",
                            }}
                          >
                            NEW
                          </span>
                        )}
                        <span style={{ fontSize: "12px", color: "#c9d1e0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {alert.type}
                        </span>
                      </div>
                    </div>

                    <div>
                      <RiskBadge risk={alert.risk} />
                    </div>

                    <div>
                      <div style={{ fontSize: "12px", color: "#8a9ab5" }}>{alert.deviceName}</div>
                      <div style={{ fontSize: "10px", color: "#4a5568", fontFamily: "JetBrains Mono" }}>{alert.device}</div>
                    </div>

                    <div style={{ fontSize: "11px", color: "#4d94ff", fontFamily: "JetBrains Mono" }}>{alert.ip}</div>

                    <div>
                      <div style={{ fontSize: "11px", color: "#6b7a99", fontFamily: "JetBrains Mono" }}>{formatTime(alert.timestamp)}</div>
                      <div style={{ fontSize: "10px", color: "#4a5568" }}>{formatDate(alert.timestamp)}</div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <button
                        className="ack-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlerts((prev) =>
                            prev.map((a) =>
                              a.id === alert.id
                                ? { ...a, acknowledged: !a.acknowledged }
                                : a,
                            ),
                          );
                          fetch(`${BASE_URL}/alerts/ack/${alert.id}`, {
                             method: "PUT",
                           }).catch(() => {});
                        }}
                        style={{
                          padding: "3px 10px",
                          borderRadius: "5px",
                          fontSize: "10px",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: alert.acknowledged ? "1px solid rgba(0,229,160,0.3)" : "1px solid rgba(255,255,255,0.1)",
                          background: alert.acknowledged ? "rgba(0,229,160,0.08)" : "rgba(255,255,255,0.04)",
                          color: alert.acknowledged ? "#00e5a0" : "#6b7a99",
                        }}
                      >
                        {alert.acknowledged ? "ACK" : "ACK"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedAlert && (
            <div
              style={{
                background: "rgba(77,148,255,0.04)",
                border: "1px solid rgba(77,148,255,0.15)",
                borderRadius: "12px",
                padding: "20px",
                animation: "slide-in 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0", marginBottom: "6px" }}>{selectedAlert.type}</div>
                  <RiskBadge risk={selectedAlert.risk} />
                </div>
                <button
                  onClick={async () => {
                       const newSelection =
                          selectedAlert?.id === alert.id ? null : alert;

                        setSelectedAlert(newSelection);

                        if (newSelection) {
                            setLoadingAI(true);
                            setAiResponse(null);

                            try {
                            const res = await fetch(
                                `${BASE_URL}/alerts/ai-suggest/${encodeURIComponent(alert.type)}`
                            );
                            const data = await res.json();
                            setAiResponse(data.ai_response);
                            } catch {
                            setAiResponse("AI engine offline.");
                            }

                            setLoadingAI(false);
                        }
                        }}
                  style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: "18px" }}
                >
                  X
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                {[
                  { label: "Alert ID", value: `ALT-${String(selectedAlert.id).padStart(4, "0")}` },
                  { label: "Source IP", value: selectedAlert.ip },
                  { label: "Device", value: `${selectedAlert.deviceName} (${selectedAlert.device})` },
                  { label: "Location", value: selectedAlert.location },
                  { label: "Timestamp", value: formatTime(selectedAlert.timestamp) },
                  { label: "Date", value: formatDate(selectedAlert.timestamp) },
                  { label: "Status", value: selectedAlert.acknowledged ? "Acknowledged" : "Pending Review" },
                  { label: "Detection Layer", value: "Edge AI + Central" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: "10px", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: "12px", color: "#8a9ab5", fontFamily: "JetBrains Mono" }}>{value}</div>
                  </div>
                ))}
              </div>
              {/* ===== AI ANALYSIS SECTION ===== */}
                    <div style={{ marginTop: "24px" }}>
                    <div
                        style={{
                        fontSize: "11px",
                        color: "#4d94ff",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "10px",
                        fontWeight: 700,
                        }}
                    >
                        AI Threat Analysis
                    </div>

                    {loadingAI ? (
                        <div style={{ color: "#6b7a99", fontSize: "12px" }}>
                        Generating AI response...
                        </div>
                    ) : (
                        <div
                        style={{
                            fontSize: "12px",
                            color: "#8a9ab5",
                            background: "rgba(0,0,0,0.25)",
                            padding: "12px",
                            borderRadius: "8px",
                            whiteSpace: "pre-wrap",
                        }}
                        >
                        {aiResponse || "Select alert to generate AI analysis"}
                        </div>
                    )}

                    {aiResponse && !resolvedIds.includes(selectedAlert.id) && (
                        <button
                        onClick={async () => {
                            setResolvedIds((prev) => [...prev, selectedAlert.id]);

                            fetch(`${BASE_URL}/alerts/resolve/${selectedAlert.id}`, {
                            method: "PUT",
                            }).catch(() => {});

                            setSelectedAlert(null);
                        }}
                        style={{
                            marginTop: "12px",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "1px solid #00e5a040",
                            background: "rgba(0,229,160,0.08)",
                            color: "#00e5a0",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                        >
                        Accept & Resolve
                        </button>
                    )}
                    </div>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          padding: "10px 28px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          color: "#2d3748",
        }}
      >
        <span>SentriEdge AI v1.0 - Hybrid Edge Cybersecurity Monitoring System</span>
        <span style={{ fontFamily: "JetBrains Mono" }}>SME SOC Platform - FastAPI + React - Edge AI</span>
      </div>
    </div>
  );
}
