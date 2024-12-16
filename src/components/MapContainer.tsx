import { Site, CompanyType, SiteType } from "@/types/site";
import MapComponent from "./MapComponent";
import CompanyLegend from "./CompanyLegend";
import SiteFilters from "./SiteFilters";

interface MapContainerProps {
  sites: Site[];
  company: CompanyType | "all";
  setCompany: (company: CompanyType | "all") => void;
  siteType: SiteType | "all";
  setSiteType: (type: SiteType | "all") => void;
  minSoilAmount: string;
  setMinSoilAmount: (amount: string) => void;
  soilType: string;
  setSoilType: (type: string) => void;
}

const MapContainer = ({ 
  sites,
  company,
  setCompany,
  siteType,
  setSiteType,
  minSoilAmount,
  setMinSoilAmount,
  soilType,
  setSoilType
}: MapContainerProps) => {
  // Filter sites based on criteria
  const filteredSites = sites.filter(site => {
    if (company !== "all" && site.company !== company) return false;
    if (siteType !== "all" && site.siteType !== siteType) return false;
    if (minSoilAmount && parseInt(site.soilAmount) < parseInt(minSoilAmount)) return false;
    if (soilType !== "all" && site.soilType !== soilType) return false;
    return true;
  });

  return (
    <div className="w-full h-[700px] lg:h-[800px] mb-6 rounded-lg overflow-hidden shadow-lg relative">
      {/* Filters Section */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 p-4">
        <SiteFilters
          company={company}
          setCompany={setCompany}
          siteType={siteType}
          setSiteType={setSiteType}
          minSoilAmount={minSoilAmount}
          setMinSoilAmount={setMinSoilAmount}
          soilType={soilType}
          setSoilType={setSoilType}
        />
      </div>
      
      {/* Legend - positioned inside map with responsive positioning */}
      <div className="absolute top-32 right-2 sm:right-4 z-50">
        <CompanyLegend />
      </div>
      
      {/* Map Component */}
      <MapComponent sites={filteredSites} />
    </div>
  );
};

export default MapContainer;