import { buildApiHeaders } from "@/lib/api-headers";
import type { CitiesResponse, CountriesResponse } from "@/types/address";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchPublicJson<T>(path: string): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const headers = await buildApiHeaders({ token: null });

  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}

export function getCountries(): Promise<CountriesResponse> {
  return fetchPublicJson("/public/countries");
}

export function getCitiesByCountryId(
  countryId: string | number
): Promise<CitiesResponse> {
  return fetchPublicJson(`/public/countries/${countryId}`);
}
