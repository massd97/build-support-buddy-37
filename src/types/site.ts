export type CompanyType = "OHD" | "Meldia" | "HawkOne";
export type SiteType = "残土" | "客土";

export interface Site {
  id: string;
  siteName: string;
  address: string;
  lat: number;
  lng: number;
  soilAmount: string;
  soilType: string;
  siteType: SiteType;
  contactPerson: string;
  email: string;
  company: CompanyType;
  latitude?: number;
  longitude?: number;
}