import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { CompanyType, SiteType } from "@/types/site";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";
import MapSearch from "@/components/MapSearch";
import ActionButtons from "@/components/ActionButtons";
import MapContainer from "@/components/MapContainer";
import MatchingSitesList from "@/components/MatchingSitesList";
import { fetchSitesFromGAS, searchSitesByAddressGAS } from "@/utils/gas";

const Index = () => {
  // Modal state controls
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [showSitesList, setShowSitesList] = useState(false);
  const [showTransactionFeed, setShowTransactionFeed] = useState(false);
  const [showMatchingSites, setShowMatchingSites] = useState(false);
  
  // Map related states
  const [mapSearch, setMapSearch] = useState("");
  const [company, setCompany] = useState<CompanyType | "all">("all");
  const [siteType, setSiteType] = useState<SiteType | "all">("all");
  const [minSoilAmount, setMinSoilAmount] = useState("");
  const [soilType, setSoilType] = useState("all");
  const [sites, setSites] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const geocoderRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoading(true);
        const response = await fetchSitesFromGAS();
        setSites(response.sites);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("サイトの読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };
    loadSites();
  }, []);

  const handleMapSearch = async () => {
    if (!mapSearch) return;
    
    try {
      const geocoder = geocoderRef.current || new window.google.maps.Geocoder();
      const results = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: mapSearch }, (results, status) => {
          if (status === "OK") {
            resolve(results);
          } else {
            reject(new Error("Geocoding failed"));
          }
        });
      });

      const firstResult = results[0];
      const { lat, lng } = firstResult.geometry.location;
      
      console.log(`lat: ${lat()}, lng: ${lng()}`);
      mapRef.current?.panTo({ lat: lat(), lng: lng() });
      
      new window.google.maps.Marker({
        position: { lat: lat(), lng: lng() },
        map: mapRef.current,
        title: mapSearch,
      });

      const searchResponse = await searchSitesByAddressGAS(mapSearch);
      setSites(searchResponse.sites);
      
      toast.success("検索完了");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("検索中にエラーが発生しました");
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

        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <Button onClick={() => setShowSiteModal(true)}>
            新規登録
          </Button>
          <Button onClick={() => setShowSitesList(true)}>
            現場一覧
          </Button>
          <Button onClick={() => setShowMatchingSites(true)}>
            マッチング現場
          </Button>
          <Button onClick={() => setShowTransactionFeed(true)}>
            取引履歴
          </Button>
        </div>
      </div>

      <SiteRegistrationModal 
        open={showSiteModal} 
        onOpenChange={setShowSiteModal}
      />
      <AvailableSitesList 
        open={showSitesList}
        onOpenChange={setShowSitesList}
      />
      <MatchingSitesList
        open={showMatchingSites}
        onOpenChange={setShowMatchingSites}
      />
      <TransactionFeed 
        open={showTransactionFeed}
        onOpenChange={setShowTransactionFeed}
      />
    </div>
  );
};

export default Index;
