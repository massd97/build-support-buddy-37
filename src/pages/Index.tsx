import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState, useCallback, useRef } from "react";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import TransactionRegistrationModal from "@/components/TransactionRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";
import { toast } from "sonner";

// Define the type for our site data
interface Site {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  soilAmount: string;
  soilType: string;
}

const Index = () => {
  // Modal state controls
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showSitesList, setShowSitesList] = useState(false);
  const [showTransactionFeed, setShowTransactionFeed] = useState(false);
  
  // Map related states
  const [mapSearch, setMapSearch] = useState("");
  const [sites, setSites] = useState<Site[]>([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 36.2048,
    lng: 138.2529,
  });
  const [zoom, setZoom] = useState(5);
  
  // Reference to the map instance
  const mapRef = useRef<google.maps.Map | null>(null);

  // Custom map styles to make it look better
  const mapStyles = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7c93a3" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#e1e9ef" }],
    },
    // ... more styling can be added here
  ];

  // Function to handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Function to handle map search
  const handleMapSearch = useCallback(async () => {
    if (!mapSearch) return;

    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ address: mapSearch + ", Japan" });
      
      if (result.results[0]) {
        const { lat, lng } = result.results[0].geometry.location;
        setMapCenter({ lat: lat(), lng: lng() });
        setZoom(12);
        toast.success("場所が見つかりました");
      } else {
        toast.error("場所が見つかりませんでした");
      }
    } catch (error) {
      toast.error("検索中にエラーが発生しました");
    }
  }, [mapSearch]);

  // Function to handle marker click
  const handleMarkerClick = (site: Site) => {
    setMapCenter({ lat: site.lat, lng: site.lng });
    setZoom(15);
    toast.info(`${site.name} - ${site.address}`);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between mb-6">
        <Button 
          onClick={() => setShowSiteModal(true)}
          className="text-lg"
        >
          現場新規登録
        </Button>
        <Button 
          onClick={() => setShowTransactionModal(true)}
          className="text-lg"
        >
          取引新規登録
        </Button>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Button 
          onClick={() => setShowSitesList(true)}
          className="text-lg"
        >
          使用可能現場一覧
        </Button>
        <Button 
          onClick={() => setShowTransactionFeed(true)}
          className="text-lg"
        >
          トランザクションフィード
        </Button>
      </div>

      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="地図を検索 (住所、現場名、担当者名、土地の量、土質)"
          value={mapSearch}
          onChange={(e) => setMapSearch(e.target.value)}
          className="w-full max-w-xl mx-auto pr-24"
          onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()}
        />
        <Button 
          onClick={handleMapSearch}
          className="absolute right-0 top-0 rounded-l-none"
          style={{ right: "calc(50% - 16rem)" }}
        >
          検索
        </Button>
      </div>

      <div className="w-full h-[500px] mb-6 rounded-lg overflow-hidden shadow-lg">
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={mapCenter}
            zoom={zoom}
            onLoad={onMapLoad}
            options={{
              styles: mapStyles,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              zoomControl: true,
            }}
          >
            {sites.map((site) => (
              <Marker
                key={site.id}
                position={{ lat: site.lat, lng: site.lng }}
                onClick={() => handleMarkerClick(site)}
                title={site.name}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      <SiteRegistrationModal 
        open={showSiteModal} 
        onOpenChange={setShowSiteModal}
      />
      <TransactionRegistrationModal 
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />
      <AvailableSitesList 
        open={showSitesList}
        onOpenChange={setShowSitesList}
      />
      <TransactionFeed 
        open={showTransactionFeed}
        onOpenChange={setShowTransactionFeed}
      />
    </div>
  );
};

export default Index;