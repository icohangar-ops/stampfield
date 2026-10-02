export type DeviceFix = {
  lat: number;
  lng: number;
  accuracyM: number | null;
};

export function readDevicePosition() {
  return new Promise<DeviceFix>((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not available in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracyM: Number.isFinite(position.coords.accuracy)
            ? position.coords.accuracy
            : null,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  });
}

export function geolocationMessage(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as GeolocationPositionError).code;
    if (code === 1) {
      return "Location permission was denied. Enter coordinates manually or save without GPS.";
    }
    if (code === 3) {
      return "GPS timed out. Try again or enter coordinates manually.";
    }
  }
  if (error instanceof Error) return error.message;
  return "Could not read a GPS fix.";
}
