export interface MapboxPrediction {
  id: string;
  placeName: string;
  mainText: string;
  secondaryText: string;
  latitude: number;
  longitude: number;
}

export async function searchPlaces(query: string): Promise<MapboxPrediction[]> {
  if (query.trim().length < 2) return [];
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '5',
    countrycodes: 'ar',
    'accept-language': 'es',
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: { 'User-Agent': 'preq-app' } }
  );
  const data = await res.json();
  return data.map((f: any) => ({
    id: f.place_id,
    placeName: f.display_name,
    mainText: f.display_name.split(',')[0],
    secondaryText: f.display_name.split(',').slice(1).join(',').trim(),
    latitude: parseFloat(f.lat),
    longitude: parseFloat(f.lon),
  }));
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: 'json',
    'accept-language': 'es',
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    { headers: { 'User-Agent': 'preq-app' } }
  );
  const data = await res.json();
  return data.display_name ?? '';
}

export function staticMapUrl(latitude: number, longitude: number, width = 600, height = 200, zoom = 16): string {
  // Uses OpenStreetMap static map via staticmap service — no token needed
  const params = new URLSearchParams({
    center: `${longitude},${latitude}`,
    zoom: String(zoom),
    size: `${width}x${height}`,
    markers: `${longitude},${latitude}`,
  });
  return `https://staticmap.openstreetmap.de/staticmap.php?${params}`;
}

// Keep the location store here
import { LocationDetectionResponse } from '@/types';

let _detected: LocationDetectionResponse | null = null;

export function setDetectedLocation(result: LocationDetectionResponse | null) {
  _detected = result;
}
export function getDetectedLocation(): LocationDetectionResponse | null {
  return _detected;
}