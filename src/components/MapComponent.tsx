import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CompanyLegend from './CompanyLegend';
import TransactionRegistrationModal from './TransactionRegistrationModal';
import { Site, CompanyType, SiteType } from '@/types/site';
import SiteFilters from './SiteFilters';

// Define company colors for map markers
const companyColors = {
  OHD: "#22c55e",
  Meldia: "#a855f7",
  HawkOne: "#f97316"
};

// Sample data for testing - Replace with actual data source
const sampleSites: Site[] = [
  {
    id: "1",
    name: "渋谷建設現場",
    address: "東京都渋谷区神南1-1-1",
    lat: 35.6612,
    lng: 139.7010,
    soilAmount: "500",
    soilType: "砂質",
    siteType: "残土",
    contactPerson: "山田太郎",
    phone: "03-1234-5678",
    company: "OHD"
  },
  {
    id: "2",
    name: "新宿工事現場",
    address: "東京都新宿区新宿3-1-1",
    lat: 35.6896,
    lng: 139.7006,
    soilAmount: "300",
    soilType: "粘土質",
    siteType: "客土",
    contactPerson: "佐藤次郎",
    phone: "03-8765-4321",
    company: "Meldia"
  }
];

const MapComponent = () => {
  // State for map interaction
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Filter states
  const [company, setCompany] = useState<CompanyType | "all">("all");
  const [siteType, setSiteType] = useState<SiteType | "all">("all");
  const [minSoilAmount, setMinSoilAmount] = useState("");
  const [soilType, setSoilType] = useState("all");

  // Map configuration
  const center = { lat: 35.6762, lng: 139.6503 }; // Tokyo center
  const mapContainerStyle = {
    width: '100%',
    height: '700px'
  };

  // Filter sites based on selected criteria
  const filteredSites = sampleSites.filter(site => {
    if (company !== "all" && site.company !== company) return false;
    if (siteType !== "all" && site.siteType !== siteType) return false;
    if (minSoilAmount && parseInt(site.soilAmount) < parseInt(minSoilAmount)) return false;
    if (soilType !== "all" && site.soilType !== soilType) return false;
    return true;
  });

  // Event Handlers
  const handleMarkerClick = (site: Site) => {
    setSelectedSite(site);
    setSelectedMarkerId(site.id);
    toast.info(`${site.name} - ${site.siteType}`);
  };

  const handleTransactionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTransactionModal(true);
  };

  // Marker icon configuration
  const getMarkerIcon = (siteType: SiteType, company: CompanyType) => ({
    path: window.google?.maps.SymbolPath.CIRCLE,
    fillColor: siteType === "残土" ? "#ef4444" : "#3b82f6",
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: companyColors[company],
    scale: 10,
  });

  return (
    <>
      <div className="w-full h-[700px] lg:h-[800px] mb-6 rounded-lg overflow-hidden shadow-lg relative">
        <CompanyLegend />
        
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

        {/* Google Maps Section */}
        <LoadScript 
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
          onLoad={() => setMapLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={11}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {/* Render Markers only after map is loaded */}
            {mapLoaded && filteredSites.map((site) => (
              <Marker
                key={site.id}
                position={{ lat: site.lat, lng: site.lng }}
                onClick={() => handleMarkerClick(site)}
                icon={getMarkerIcon(site.siteType, site.company)}
              />
            ))}

            {/* Info Window for selected site */}
            {selectedMarkerId && selectedSite && (
              <InfoWindow
                position={{ lat: selectedSite.lat, lng: selectedSite.lng }}
                onCloseClick={() => {
                  setSelectedMarkerId(null);
                  setSelectedSite(null);
                }}
              >
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{selectedSite.name}</h3>
                    <Badge variant={selectedSite.siteType === "残土" ? "destructive" : "default"}>
                      {selectedSite.siteType}
                    </Badge>
                  </div>
                  <p><span className="font-semibold">住所:</span> {selectedSite.address}</p>
                  <p><span className="font-semibold">担当者:</span> {selectedSite.contactPerson}</p>
                  <p><span className="font-semibold">連絡先:</span> {selectedSite.phone}</p>
                  <p><span className="font-semibold">担当会社:</span> {selectedSite.company}</p>
                  <Button 
                    className="w-full mt-4"
                    onClick={handleTransactionClick}
                  >
                    取引を申請
                  </Button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Transaction Modal */}
      <TransactionRegistrationModal 
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />
    </>
  );
};

export default MapComponent;