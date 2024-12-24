import { useState, useRef } from "react";
import { toast } from "sonner";
import { CompanyType, SiteType } from "@/types/site";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";
import MapSearch from "@/components/MapSearch";
import ActionButtons from "@/components/ActionButtons";
import MapContainer from "@/components/MapContainer";

const fetchSites = async () => {
  try {
    // Fetch sites from API

    return [];
  } catch (error) {
    toast.error("Failed to fetch sites");
    return [];
  }
}

// Sample data for testing - Replace with actual data source
const sampleSites = [
  {
    id: "1",
    name: "渋谷建設現場",
    address: "東京都渋谷区神南1-1-1",
    lat: 35.66,
    lng: 139.7010,
    soilAmount: "500",
    soilType: "砂質",
    siteType: "残土" as SiteType,
    contactPerson: "三谷敦也",
    phone: "03-1234-5678",
    company: "OHD" as CompanyType
  },
  {
    id: "2",
    name: "新宿工事現場",
    address: "東京都新宿区新宿3-1-1",
    lat: 35.6896,
    lng: 139.7006,
    soilAmount: "300",
    soilType: "粘土質",
    siteType: "客土" as SiteType,
    contactPerson: "田中和紀",
    phone: "03-8765-4321",
    company: "Meldia" as CompanyType
  },
  {
    id: "3",
    name: "新宿工事現場",
    address: "東京都新宿区新宿3-1-1",
    lat: 35.5933,
    lng: 139.7006,
    soilAmount: "300",
    soilType: "粘土質",
    siteType: "客土" as SiteType,
    contactPerson: "佐伯研介",
    phone: "03-8765-4321",
    company: "HawkOne" as CompanyType
  }
];

const Index = () => {

  console.log('Index.tsx requiered');
  // Modal state controls
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [showSitesList, setShowSitesList] = useState(false);
  const [showTransactionFeed, setShowTransactionFeed] = useState(false);
  
  // Map related states
  const [mapSearch, setMapSearch] = useState("");
  const [company, setCompany] = useState<CompanyType | "all">("all");
  const [siteType, setSiteType] = useState<SiteType | "all">("all");
  const [minSoilAmount, setMinSoilAmount] = useState("");
  const [soilType, setSoilType] = useState("all");
  const geocoderRef = useRef(null);
  const mapRef = useRef(null);
  
const handleMapSearch = async () => {
  if (!mapSearch) return;
    try {
      const geocoder = geocoderRef.current || new window.google.maps.Geocoder();
      geocoder.geocode({ address: mapSearch }, (results, status) => {
        if (status === "OK") {
          console.log(`address: ${mapSearch}, results: ${JSON.stringify(results)}, status: ${status}`);
          // `results` contains an array of matching locations.
          const { geometry } = results[0]; // usually the first result is the best match
          // Extract the coordinates
          const { lat, lng } = geometry.location;

          console.log(`lat: ${lat()}, lng: ${lng()}`);
  
          // Center the map on this location
          // Assuming you have a reference to the map instance:
          mapRef.current.panTo({ lat: lat(), lng: lng() });
          
          // Optionally place a marker there:
          new window.google.maps.Marker({
            position: { lat: lat(), lng: lng() },
            map: mapRef.current,
            title: mapSearch,
          });
  
          toast.success("検索完了");
        } else {
          toast.error("位置情報が見つかりませんでした");
        }
      });
    } catch (error) {
      console.log(`Error: ${error.message}`);
      toast.error(`検索中にエラーが発生しました`);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <h1 className="text-2xl font-bold text-center mb-6 text-primary">
        SoilSync
      </h1>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-1">
            <MapSearch
              mapSearch={mapSearch}
              setMapSearch={setMapSearch}
              handleMapSearch={handleMapSearch}
            />
          </div>
        </div>

        <MapContainer 
          sites={sampleSites}
          company={company}
          setCompany={setCompany}
          siteType={siteType}
          setSiteType={setSiteType}
          minSoilAmount={minSoilAmount}
          setMinSoilAmount={setMinSoilAmount}
          soilType={soilType}
          setSoilType={setSoilType}
        />

        <ActionButtons
          setShowSiteModal={setShowSiteModal}
          setShowSitesList={setShowSitesList}
          setShowTransactionFeed={setShowTransactionFeed}
        />
      </div>

      {/* Modals */}
      <SiteRegistrationModal 
        open={showSiteModal} 
        onOpenChange={setShowSiteModal}
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