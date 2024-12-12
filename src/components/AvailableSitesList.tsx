import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import TransactionRegistrationModal from "./TransactionRegistrationModal";
import SitesTable from "./SitesTable";
import SiteDetailsDialog from "./SiteDetailsDialog";

interface AvailableSitesListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample data for testing
const sampleSites = [
  {
    id: "1",
    name: "渋谷建設現場",
    address: "東京都渋谷区神南1-1-1",
    lat: 35.6612,
    lng: 139.7010,
    soilAmount: "500㎥",
    soilType: "砂質土",
    contactPerson: "山田太郎",
    phone: "03-1234-5678"
  },
  {
    id: "2",
    name: "新宿工事現場",
    address: "東京都新宿区新宿3-1-1",
    lat: 35.6896,
    lng: 139.7006,
    soilAmount: "300㎥",
    soilType: "粘土",
    contactPerson: "佐藤次郎",
    phone: "03-8765-4321"
  }
];

const AvailableSitesList = ({ open, onOpenChange }: AvailableSitesListProps) => {
  const [search, setSearch] = useState("");
  const [selectedSite, setSelectedSite] = useState<typeof sampleSites[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Filter sites based on search input
  const filteredSites = sampleSites.filter(site => 
    site.name.toLowerCase().includes(search.toLowerCase()) ||
    site.address.toLowerCase().includes(search.toLowerCase()) ||
    site.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  const handleMainDialogClose = (open: boolean) => {
    if (!open) {
      setSearch("");
      setSelectedSite(null);
      setShowDetails(false);
      setShowTransactionModal(false);
    }
    onOpenChange(open);
  };

  const handleSiteClick = (site: typeof sampleSites[0]) => {
    setSelectedSite(site);
    setShowDetails(true);
  };

  const handleTransactionClick = () => {
    setShowTransactionModal(true);
    setShowDetails(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleMainDialogClose}>
        <DialogContent className="sm:max-w-[800px] [&>*]:!z-[1000]">
          <DialogHeader>
            <DialogTitle>使用可能現場一覧</DialogTitle>
            <DialogDescription>
              現場を選択して詳細を確認できます
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="検索 (住所、現場名、担当者名)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />
            <SitesTable 
              sites={filteredSites}
              onSiteClick={handleSiteClick}
            />
          </div>
        </DialogContent>
      </Dialog>

      <SiteDetailsDialog
        site={selectedSite}
        open={showDetails}
        onOpenChange={setShowDetails}
        onTransactionClick={handleTransactionClick}
      />

      <TransactionRegistrationModal 
        open={showTransactionModal}
        onOpenChange={(open) => {
          setShowTransactionModal(open);
          if (!open) {
            handleMainDialogClose(false);
          }
        }}
      />
    </>
  );
};

export default AvailableSitesList;