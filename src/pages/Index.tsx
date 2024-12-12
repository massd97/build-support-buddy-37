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
import { useState } from "react";
import { toast } from "sonner";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import TransactionRegistrationModal from "@/components/TransactionRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";
import MapSearch from "@/components/MapSearch";
import ActionButtons from "@/components/ActionButtons";
import MapComponent from "@/components/MapComponent";

const Index = () => {
  // Modal state controls
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showSitesList, setShowSitesList] = useState(false);
  const [showTransactionFeed, setShowTransactionFeed] = useState(false);
  
  // Map related states
  const [mapSearch, setMapSearch] = useState("");

  /**
   * Handles the map search functionality
   */
  const handleMapSearch = async () => {
    if (!mapSearch) return;
    
    try {
      // Here you would typically integrate with a geocoding service
      toast.success("検索機能は現在実装中です");
    } catch (error) {
      toast.error("検索中にエラーが発生しました");
    }
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

      <MapComponent />

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