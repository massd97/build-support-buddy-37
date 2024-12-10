import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState, useCallback, useRef } from "react";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import TransactionRegistrationModal from "@/components/TransactionRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, List } from "lucide-react";

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
      {/* Registration buttons and Lists dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        {/* Registration buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
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

        {/* Lists dropdown - centers on small screens */}
        <div className="w-full sm:w-auto flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <List className="h-4 w-4" />
                リスト表示
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setShowSitesList(true)}>
                使用可能現場一覧
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowTransactionFeed(true)}>
                トランザクションフィード
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-0 items-center max-w-xl mx-auto">
        <Input
          type="text"
          placeholder="地図を検索 (住所、現場名、担当者名、土地の量、土質)"
          value={mapSearch}
          onChange={(e) => setMapSearch(e.target.value)}
          className="w-full sm:rounded-r-none"
          onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()}
        />
        <Button 
          onClick={handleMapSearch}
          className="w-full sm:w-auto sm:rounded-l-none"
        >
          検索
        </Button>
      </div>

      {/* Map container and Modals */}
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

      {/* Modals */}
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
