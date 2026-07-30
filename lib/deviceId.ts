const DEVICE_ID_KEY = "bijou-device-id";

function createDeviceId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) {
    return existing;
  }

  const deviceId = createDeviceId();
  localStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
}
