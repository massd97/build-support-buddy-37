import { Site, CompanyType, SiteType } from "@/types/site";
import MapComponent from "./MapComponent";
import CompanyLegend from "./CompanyLegend";
import SiteTypeLegend from "./SiteTypeLegend";
import SiteFilters from "./SiteFilters";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const filteredSites = sites.filter(site => {
    if (company !== "all" && site.company !== company) return false;
    if (siteType !== "all" && site.siteType !== siteType) return false;
    if (minSoilAmount && parseInt(site.soilVolume) < parseInt(minSoilAmount)) return false;
    if (soilType !== "all" && site.soilType !== soilType) return false;
    return true;
  });

  return (
    <div className="w-full h-[600px] lg:h-[800px] mb-6 rounded-lg overflow-hidden shadow-lg relative">
      <div className="absolute top-0 left-0 right-0 z-40">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="bg-white/70 backdrop-blur-sm p-2 sm:p-4">
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
      
      <div className={`absolute ${isMobile ? 'bottom-20' : 'bottom-6'} left-2 sm:left-2 z-30`}>
        <CompanyLegend />
      </div>
      <div className={`absolute ${isMobile ? 'bottom-44' : 'bottom-32'} left-6 sm:left-2 z-30`}>
        <SiteTypeLegend />
      </div>
      
      <MapComponent sites={filteredSites} />
    </div>
  );
};

export default MapContainer;