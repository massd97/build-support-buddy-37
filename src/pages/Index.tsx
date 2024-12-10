/**
 * Index Page Component
 * 
 * This is the main page of the application that integrates all the core functionalities:
 * - Site registration and management
 * - Transaction handling
 * - Map visualization
 * - Search capabilities
 * 
 * The component is structured to be maintainable and scalable, with clear separation
 * of concerns between different functional areas.
 */
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import TransactionRegistrationModal from "@/components/TransactionRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";
import MapSearch from "@/components/MapSearch";
import ActionButtons from "@/components/ActionButtons";
import MapComponent from "@/components/MapComponent";

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

  /**
   * Handles the map load event and stores the map reference
   * @param {google.maps.Map} map - The Google Maps instance
   */
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  /**
   * Handles the map search functionality
   * Uses Google Geocoding service to find locations
   */
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

  /**
   * Handles marker click events on the map
   * Shows site information and centers the map on the clicked location
   * @param {Site} site - The site object associated with the clicked marker
   */
  const handleMarkerClick = (site: Site) => {
    setMapCenter({ lat: site.lat, lng: site.lng });
    setZoom(15);
    toast.info(`${site.name} - ${site.address}`);
  };

  return (
    <div className="min-h-screen p-4">
      <ActionButtons
        setShowSiteModal={setShowSiteModal}
        setShowTransactionModal={setShowTransactionModal}
        setShowSitesList={setShowSitesList}
        setShowTransactionFeed={setShowTransactionFeed}
      />

      <MapSearch
        mapSearch={mapSearch}
        setMapSearch={setMapSearch}
        handleMapSearch={handleMapSearch}
      />

      <MapComponent
        mapCenter={mapCenter}
        zoom={zoom}
        sites={sites}
        onMapLoad={onMapLoad}
        handleMarkerClick={handleMarkerClick}
      />

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