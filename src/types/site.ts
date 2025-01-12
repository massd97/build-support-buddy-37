export type CompanyType = "OHD" | "Meldia" | "HawkOne";
export type SiteType = "残土" | "客土";

export interface Site {
  ID: string;
  siteName: string;
  address: string;
  lat: number;
  lng: number;
  soilVolume: string;
  requiredSoilVolume: string;
  soilType: string;
  siteType: SiteType;
  startDate: string;
  endDate: string;
  contactPerson: string;
  email: string;
  company: CompanyType;
  Image?: string;
  previousUse: string;
  dumpSize: string;
  smallTransport: "無" | "有";
}