/**
 * MapComponent
 * 
 * This component handles the Leaflet map integration, including interactive
 * markers that show site information when clicked.
 */
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import TransactionRegistrationModal from './TransactionRegistrationModal';

// Fix for default marker icon in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Sample data for testing
const sampleSites = [
  {
    id: "1",
    name: "渋谷建設現場",
    address: "東京都渋谷区神南1-1-1",
    lat: 35.6612,
    lng: 139.7010,
    soilAmount: "500㎥",
    soilType: "砂質土",
    contactPerson: "山田太郎",
    phone: "03-1234-5678"
  },
  {
    id: "2",
    name: "新宿工事現場",
    address: "東京都新宿区新宿3-1-1",
    lat: 35.6896,
    lng: 139.7006,
    soilAmount: "300㎥",
    soilType: "粘土",
    contactPerson: "佐藤次郎",
    phone: "03-8765-4321"
  }
];

// Set up default icon for markers
const defaultIcon = new Icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapComponent = () => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState<typeof sampleSites[0] | null>(null);
  
  // Center map on Tokyo
  const defaultCenter: LatLngExpression = [35.6762, 139.6503];
  
  return (
    <>
      <div className="w-full h-[500px] mb-6 rounded-lg overflow-hidden shadow-lg relative">
        <MapContainer 
          center={defaultCenter}
          zoom={11} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {sampleSites.map((site) => (
            <Marker
              key={site.id}
              position={[site.lat, site.lng] as LatLngExpression}
              icon={defaultIcon}
              eventHandlers={{
                click: () => {
                  toast.info(`${site.name} - ${site.address}`);
                },
              }}
            >
              <Popup className="w-64">
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{site.name}</h3>
                  <p><span className="font-semibold">住所:</span> {site.address}</p>
                  <p><span className="font-semibold">残土の量:</span> {site.soilAmount}</p>
                  <p><span className="font-semibold">土質:</span> {site.soilType}</p>
                  <p><span className="font-semibold">担当者:</span> {site.contactPerson}</p>
                  <p><span className="font-semibold">連絡先:</span> {site.phone}</p>
                  <Button 
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSite(site);
                      setShowTransactionModal(true);
                    }}
                  >
                    取引を申請
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <TransactionRegistrationModal 
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />
    </>
  );
};

export default MapComponent;