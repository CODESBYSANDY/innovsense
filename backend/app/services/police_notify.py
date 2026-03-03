import requests

CYBER_POLICE_ENDPOINT = "https://cybercrime.gov.in/api/report"  # example

def notify_cyber_police(alert):
    try:
        payload = {
            "device_id": alert.device_id,
            "alert_type": alert.alert_type,
            "risk_level": alert.risk_level,
            "source_ip": alert.source_ip,
        }

        # Simulated API call
        # requests.post(CYBER_POLICE_ENDPOINT, json=payload)

        return True
    except:
        return False