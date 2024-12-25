import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { CompanyType, SiteType } from "@/types/site";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";
import MapSearch from "@/components/MapSearch";
import ActionButtons from "@/components/ActionButtons";
import MapContainer from "@/components/MapContainer";

declare const google: {
  script: {
    run: {
      withSuccessHandler: <T>(callback: (response: T) => void) => {
        withFailureHandler: (callback: (error: any) => void) => {
          fetchSites: () => void;
        };
      };
    };
  };
};

interface FetchSitesResponse {
  success: boolean;
  message: string;
  sites: any[]; // Update the type of `sites` based on your data structure if needed
}

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
  const [sites, setSites] = useState<any[]>([]); // State for fetched sites
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const geocoderRef = useRef(null);
  const mapRef = useRef(null);

  // Fetch sites from GAS
  useEffect(() => {
    const fetchSites = () => {
      console.log('fetching sites...');
      setLoading(true);
      setError(null);
      google.script.run
        .withSuccessHandler((response: FetchSitesResponse) => {
          console.log('Received response from GAS:', response);
          if (!response) {
            console.error('Received null response from GAS');
            setError('Received null response from the server.');
            setLoading(false);
            return;
          }          
          if (response && typeof response === 'object' && response.success !== undefined) {
            if (response.success) {
              setSites(response.sites);
              console.log('Sites state updated:', response.sites); // Log updated sites
            } else {
              setError(response.message || 'Failed to fetch sites.');
              console.error('Fetch error message:', response.message); // Log error message
            }
          } else {
            console.error('Unexpected response format:', response); // Log unexpected formats
            setError('Unexpected response from the server.');
          }
          setLoading(false);
        })
        .withFailureHandler((err) => {
          console.error("Error fetching sites:", err);
          setError("An error occurred while fetching sites.");
          setLoading(false);
        })
        .fetchSites(); // GAS関数
    };
    fetchSites();
  }, []);

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
          sites={sites}
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