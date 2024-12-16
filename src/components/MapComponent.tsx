/**
 * MapComponent
 * 
 * This component handles the Google Maps integration, including interactive
 * markers that show site information when clicked.
 */
import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CompanyLegend from './CompanyLegend';
import TransactionRegistrationModal from './TransactionRegistrationModal';

// Sample data for testing - Replace with actual data source
const sampleSites = [
  {
    id: "1",
    name: "渋谷建設現場",
    address: "東京都渋谷区神南1-1-1",
    lat: 35.6612,
    lng: 139.7010,
    contactPerson: "山田太郎",
    email: "yamada@example.com",
    siteType: "残土" as const,
    company: "OHD" as const
  },
  {
    id: "2",
    name: "新宿工事現場",
    address: "東京都新宿区新宿3-1-1",
    lat: 35.6896,
    lng: 139.7006,
    contactPerson: "佐藤次郎",
    email: "sato@example.com",
    siteType: "客土" as const,
    company: "Meldia" as const
  }
];

const companyColors = {
  OHD: "#22c55e", // green-500
  Meldia: "#a855f7", // purple-500
  HawkOne: "#f97316" // orange-500
};

const MapComponent = () => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState<typeof sampleSites[0] | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  
  const center = { lat: 35.6762, lng: 139.6503 }; // Tokyo center
  const mapContainerStyle = {
    width: '100%',
    height: '700px'
  };

  const handleMarkerClick = (site: typeof sampleSites[0]) => {
    setSelectedSite(site);
    setSelectedMarkerId(site.id);
    toast.info(`${site.name} - ${site.siteType}`);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarkerId(null);
    setSelectedSite(null);
  };

  const handleTransactionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTransactionModal(true);
  };

  return (
    <>
      <div className="w-full h-[700px] lg:h-[800px] mb-6 rounded-lg overflow-hidden shadow-lg relative">
        <CompanyLegend />
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
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
            {sampleSites.map((site) => (
              <Marker
                key={site.id}
                position={{ lat: site.lat, lng: site.lng }}
                onClick={() => handleMarkerClick(site)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: site.siteType === "残土" ? "#ef4444" : "#3b82f6",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: companyColors[site.company],
                  scale: 10,
                }}
              />
            ))}

            {selectedMarkerId && selectedSite && (
              <InfoWindow
                position={{ lat: selectedSite.lat, lng: selectedSite.lng }}
                onCloseClick={handleInfoWindowClose}
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
                  <p><span className="font-semibold">連絡先:</span> {selectedSite.email}</p>
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

      <TransactionRegistrationModal 
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />
    </>
  );
};

export default MapComponent;