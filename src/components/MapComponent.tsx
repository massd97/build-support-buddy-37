/**
 * MapComponent
 * 
 * This component handles the Google Maps integration, including interactive
 * markers that show site information when clicked.
 */
import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    email: "yamada@example.com"
  },
  {
    id: "2",
    name: "新宿工事現場",
    address: "東京都新宿区新宿3-1-1",
    lat: 35.6896,
    lng: 139.7006,
    contactPerson: "佐藤次郎",
    email: "sato@example.com"
  }
];

const MapComponent = () => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState<typeof sampleSites[0] | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  
  const center = { lat: 35.6762, lng: 139.6503 }; // Tokyo center
  const mapContainerStyle = {
    width: '100%',
    height: '700px'
  };

  // Custom marker icons can be defined here
  // ADD_MARKER: Define new marker icons or colors here
  const defaultMarkerOptions = {
    // You can customize marker appearance here
  };

  const handleMarkerClick = (site: typeof sampleSites[0]) => {
    setSelectedSite(site);
    setSelectedMarkerId(site.id);
    toast.info(`${site.name} - ${site.address}`);
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
      <div className="w-full h-[700px] lg:h-[800px] mb-6 rounded-lg overflow-hidden shadow-lg">
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
            {/* ADD_MARKER: Add new markers by pushing to sampleSites array */}
            {sampleSites.map((site) => (
              <Marker
                key={site.id}
                position={{ lat: site.lat, lng: site.lng }}
                onClick={() => handleMarkerClick(site)}
                options={defaultMarkerOptions}
              />
            ))}

            {selectedMarkerId && selectedSite && (
              <InfoWindow
                position={{ lat: selectedSite.lat, lng: selectedSite.lng }}
                onCloseClick={handleInfoWindowClose}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2">{selectedSite.name}</h3>
                  <p><span className="font-semibold">住所:</span> {selectedSite.address}</p>
                  <p><span className="font-semibold">担当者:</span> {selectedSite.contactPerson}</p>
                  <p><span className="font-semibold">連絡先:</span> {selectedSite.email}</p>
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