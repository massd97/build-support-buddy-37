import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useState } from "react";
import SiteRegistrationModal from "@/components/SiteRegistrationModal";
import TransactionRegistrationModal from "@/components/TransactionRegistrationModal";
import AvailableSitesList from "@/components/AvailableSitesList";
import TransactionFeed from "@/components/TransactionFeed";

const Index = () => {
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showSitesList, setShowSitesList] = useState(false);
  const [showTransactionFeed, setShowTransactionFeed] = useState(false);
  const [mapSearch, setMapSearch] = useState("");

  const center = {
    lat: 36.2048,
    lng: 138.2529,
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

      <div className="mb-6">
        <Input
          type="text"
          placeholder="地図を検索 (住所、現場名、担当者名、土地の量、土質)"
          value={mapSearch}
          onChange={(e) => setMapSearch(e.target.value)}
          className="w-full max-w-xl mx-auto"
        />
      </div>

      <div className="w-full h-[500px] mb-6">
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={center}
            zoom={5}
          />
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