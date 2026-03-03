import { useEffect, useState } from "react";
import { getAISuggestion, resolveAlert } from "../services/api";

export default function AlertModal({ alert, close }) {
  const [aiText, setAiText] = useState("");

  useEffect(() => {
    getAISuggestion(alert.alert_type).then(data =>
      setAiText(data.ai_response)
    );
  }, [alert]);

  const handleResolve = async () => {
    await resolveAlert(alert.id);
    alert.is_resolved = true;
    close();
  };

  return (
    <div style={{ background: "#222", padding: 20 }}>
      <h3>{alert.alert_type}</h3>
      <pre>{aiText}</pre>
      <button onClick={handleResolve}>Accept & Resolve</button>
      <button onClick={close}>Close</button>
    </div>
  );
}