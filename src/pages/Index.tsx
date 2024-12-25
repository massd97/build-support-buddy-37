import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CompanyType, SiteType } from "@/types/site";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";
import MapSearch from "@/components/MapSearch";
import ActionButtons from "@/components/ActionButtons";
import MapContainer from "@/components/MapContainer";

// Update the Google Script type declaration
declare const google: {
  script: {
    run: {
      withSuccessHandler: <T>(callback: (response: T) => void) => {
        withFailureHandler: (callback: (error: any) => void) => {
          fetchSites: () => void;
          searchSitesByAddress: (address: string) => void;
        };
      };
    };
  };
};

const Index = () => {
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

  // Fetch sites from GAS
  useEffect(() => {
    console.log('Fetching sites...');
    setLoading(true);
    setError(null);
    
    google.script.run
      .withSuccessHandler((response: any) => {
        console.log('Response from GAS:', response);
        if (response.success) {
          setSites(response.sites);
          if (response.sites.length === 0) {
            toast.info("現場データがありません");
          }
        } else {
          setError(response.message || "Failed to fetch sites.");
          toast.error(response.message || "現場データの取得に失敗しました");
        }
        setLoading(false);
      })
      .withFailureHandler((err) => {
        console.error("Error fetching sites:", err);
        setError("現場データの取得中にエラーが発生しました");
        toast.error("現場データの取得中にエラーが発生しました");
        setLoading(false);
      })
      .fetchSites();
  }, []);

  const handleMapSearch = async () => {
    if (!mapSearch) return;
    try {
      google.script.run
        .withSuccessHandler((response: any) => {
          if (response.success) {
            setSites(response.sites);
            toast.success("検索完了");
          } else {
            toast.error(response.message || "検索に失敗しました");
          }
        })
        .withFailureHandler((error) => {
          console.error("Search error:", error);
          toast.error("検索中にエラーが発生しました");
        })
        .searchSitesByAddress(mapSearch);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("検索中にエラーが発生しました");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

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