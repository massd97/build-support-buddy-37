import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TransactionRegistrationModal from "./TransactionRegistrationModal";

interface AvailableSitesListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample data for testing - same structure as map data
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
    site.name.includes(search) ||
    site.address.includes(search) ||
    site.contactPerson.includes(search)
  );

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedSite(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] [&_*]:!z-[1000]">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>現場名</TableHead>
                  <TableHead>住所</TableHead>
                  <TableHead>担当者</TableHead>
                  <TableHead>残土の量</TableHead>
                  <TableHead>土質</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow
                    key={site.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedSite(site);
                      setShowDetails(true);
                    }}
                  >
                    <TableCell>{site.name}</TableCell>
                    <TableCell>{site.address}</TableCell>
                    <TableCell>{site.contactPerson}</TableCell>
                    <TableCell>{site.soilAmount}</TableCell>
                    <TableCell>{site.soilType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={handleCloseDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>現場詳細情報</DialogTitle>
          </DialogHeader>
          {selectedSite && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">{selectedSite.name}</h3>
                <div className="space-y-2">
                  <p><span className="font-semibold">住所:</span> {selectedSite.address}</p>
                  <p><span className="font-semibold">残土の量:</span> {selectedSite.soilAmount}</p>
                  <p><span className="font-semibold">土質:</span> {selectedSite.soilType}</p>
                  <p><span className="font-semibold">担当者:</span> {selectedSite.contactPerson}</p>
                  <p><span className="font-semibold">連絡先:</span> {selectedSite.phone}</p>
                  <p><span className="font-semibold">位置情報:</span> {selectedSite.lat}, {selectedSite.lng}</p>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => {
                    setShowTransactionModal(true);
                    setShowDetails(false);
                  }}
                >
                  取引を申請
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transaction Modal */}
      <TransactionRegistrationModal 
        open={showTransactionModal}
        onOpenChange={setShowTransactionModal}
      />
    </>
  );
};

export default AvailableSitesList;