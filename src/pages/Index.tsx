import { useState } from "react";
import { toast } from "sonner";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";
import MapSearch from "@/components/MapSearch";
import ActionButtons from "@/components/ActionButtons";
import MapComponent from "@/components/MapComponent";

const Index = () => {
  // Modal state controls
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [showSitesList, setShowSitesList] = useState(false);
  const [showTransactionFeed, setShowTransactionFeed] = useState(false);
  
  // Map related states
  const [mapSearch, setMapSearch] = useState("");

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

      <MapSearch
        mapSearch={mapSearch}
        setMapSearch={setMapSearch}
        handleMapSearch={handleMapSearch}
      />

      <MapComponent />

      <ActionButtons
        setShowSiteModal={setShowSiteModal}
        setShowSitesList={setShowSitesList}
        setShowTransactionFeed={setShowTransactionFeed}
      />

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