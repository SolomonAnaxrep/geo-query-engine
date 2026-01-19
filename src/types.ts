export type Route = '/' | '/zippopotomus' | '/open-street-map';

export interface ZippopotamusPlace {
  'place name': string;
  longitude: string;
  latitude: string;
  state: string;
  'state abbreviation': string;
  'post code': string;
}

export interface ZippopotamusResponse {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: ZippopotamusPlace[];
}

export interface NominatimAddress {
  city?: string;
  state?: string;
  country?: string;
  country_code?: string;
  postcode?: string;
  street?: string;
  house_number?: string;
  suburb?: string;
  county?: string;
  neighbourhood?: string;
  [key: string]: string | undefined;
}

export interface NominatimSearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
  boundingbox?: string[];
  importance?: number;
  class?: string;
  type?: string;
}

export interface NominatimReverseResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
  boundingbox?: string[];
}
