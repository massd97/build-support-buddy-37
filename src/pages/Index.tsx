import { useState } from "react";
import { toast } from "sonner";
import { CompanyType, SiteType } from "@/types/site";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";
import MapSearch from "@/components/MapSearch";
import ActionButtons from "@/components/ActionButtons";
import MapContainer from "@/components/MapContainer";

// Sample data for testing - Replace with actual data source
const sampleSites = [
  {
    id: "1",
    name: "渋谷建設現場",
    address: "東京都渋谷区神南1-1-1",
    lat: 35.6612,
    lng: 139.7010,
    soilAmount: "500",
    soilType: "砂質",
    siteType: "残土" as SiteType,
    contactPerson: "山田太郎",
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
    contactPerson: "佐藤次郎",
    phone: "03-8765-4321",
    company: "Meldia" as CompanyType
  }
];

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

  const handleMapSearch = async () => {
    if (!mapSearch) return;
    try {
      toast.success("検索機能は現在実装中です");
    } catch (error) {
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