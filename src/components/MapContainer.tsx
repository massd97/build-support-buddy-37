import { Site } from "@/types/site";
import MapComponent from "./MapComponent";
import CompanyLegend from "./CompanyLegend";
import SiteFilters from "./SiteFilters";

interface MapContainerProps {
  sites: Site[];
}

const MapContainer = ({ sites }: MapContainerProps) => {
  return (
    <div className="w-full h-[700px] lg:h-[800px] mb-6 rounded-lg overflow-hidden shadow-lg relative">
      {/* Filters Section */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 p-4">
        <SiteFilters />
      </div>
      
      {/* Legend - positioned inside map but above filters */}
      <CompanyLegend className="absolute top-32 right-4 z-50" />
      
      {/* Map Component */}
      <MapComponent sites={sites} />
    </div>
  );
};

export default MapContainer;