def calculate_risk(heart_rate: float) -> str:
    if heart_rate > 140:
        return "HIGH"
    elif heart_rate > 100:
        return "MEDIUM"
    else:
        return "LOW"