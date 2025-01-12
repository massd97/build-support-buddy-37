import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import TransactionRegistrationModal from "./TransactionRegistrationModal";
import SitesTable from "./SitesTable";
import SiteDetailsDialog from "./SiteDetailsDialog";

interface MatchingSitesListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MatchingSitesList = ({ open, onOpenChange }: MatchingSitesListProps) => {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<typeof sites[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      const decodeBase64 = (base64: string): string => {
        const binaryString = atob(base64);
        const binaryData = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        return new TextDecoder("utf-8").decode(binaryData);
      };
      google.script.run
        .withSuccessHandler((compressedResponse: string) => {
          console.log("Received compressed response from GAS:", compressedResponse);
          const decodeString = decodeBase64(compressedResponse);
          console.log("Decoded response from GAS:", decodeString);
          const response = JSON.parse(decodeString);
          if (response.success) {
            setSites(response.sites);
          } else {
            setError(response.message || "Failed to fetch matching sites.");
          }
          setLoading(false);
        })
        .withFailureHandler((err) => {
          console.error("Error fetching matching sites:", err);
          setError("An error occurred while fetching matching sites.");
          setLoading(false);
        })
        .fetchMatchingSites(); // New GAS function to be implemented
    }
  }, [open]);

  const handleMainDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedSite(null);
      setShowDetails(false);
      setShowTransactionModal(false);
    }
    onOpenChange(open);
  };

  const handleSiteClick = (site: any) => {
    setSelectedSite(site);
    setShowDetails(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleMainDialogClose}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>マッチング現場一覧</DialogTitle>
            <DialogDescription>
              マッチングした現場を選択し、取引申請及び詳細を確認できます
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {loading ? (
              <div>取得中...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <SitesTable 
                sites={sites}
                onSiteClick={handleSiteClick}
                onEditClick={() => {}} // Not needed for matching sites
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showDetails && selectedSite && (
        <SiteDetailsDialog
          site={selectedSite}
          open={showDetails}
          onOpenChange={setShowDetails}
          onTransactionClick={(site) => {
            setSelectedSite(site);
            setShowTransactionModal(true);
          }}
          onEditClick={() => {}} // Not needed for matching sites
        />
      )}

      {showTransactionModal && selectedSite && (
        <TransactionRegistrationModal 
          open={showTransactionModal}
          onOpenChange={(open) => {
            setShowTransactionModal(open);
            if (!open) {
              handleMainDialogClose(false);
            }
          }}
          siteData={{
            siteName: selectedSite.siteName,
            address: selectedSite.address,
            email: selectedSite.email,
            contactPerson: selectedSite.contactPerson,
            soilVolume: selectedSite.soilVolume,
          }}
        />
      )}
    </>
  );
};

export default MatchingSitesList;