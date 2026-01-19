export type Route = '/' | '/zippopotomus' | '/open-street-map';

export interface ZippopotamusPlace {
  'place name': string;
  longitude: string;
  latitude: string;
  state: string;
  'state abbreviation': string;
}

export interface ZippopotamusResponse {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: ZippopotamusPlace[];
}
