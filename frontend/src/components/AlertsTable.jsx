import { useEffect, useState } from "react";
import { getAlerts, ackAlert } from "../services/api";
import AlertModal from "./AlertModal";

export default function AlertTable() {
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAlerts().then(setAlerts);
  }, []);

  const handleAck = async (id) => {
    await ackAlert(id);
    setAlerts(alerts.map(a =>
      a.id === id ? { ...a, is_acknowledged: true } : a
    ));
  };

  return (
    <div>
      {alerts.map(alert => (
        <div key={alert.id} style={{ border: "1px solid gray", margin: 10 }}>
          <p onClick={() => setSelected(alert)}>
            {alert.alert_type} - {alert.risk_level}
          </p>

          {alert.is_acknowledged ? (
            <span>✔ ACK</span>
          ) : (
            <button onClick={() => handleAck(alert.id)}>ACK</button>
          )}
        </div>
      ))}

      {selected && (
        <AlertModal alert={selected} close={() => setSelected(null)} />
      )}
    </div>
  );
}