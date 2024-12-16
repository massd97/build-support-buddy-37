import { Site, CompanyType, SiteType } from "@/types/site";
import MapComponent from "./MapComponent";
import CompanyLegend from "./CompanyLegend";
import SiteFilters from "./SiteFilters";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

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
      {/* Collapsible Filters Section */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="bg-white/90 p-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between mb-2">
                フィルター
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
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
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
      
      {/* Legend - positioned at bottom left with padding to avoid buttons */}
      <div className="absolute bottom-32 left-2 sm:left-4 z-50">
        <CompanyLegend />
      </div>
      
      {/* Map Component */}
      <MapComponent sites={filteredSites} />
    </div>
  );
};

export default MapContainer;