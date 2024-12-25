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
declare const google: {
  script: {
    run: {
      withSuccessHandler: (callback: (response) => void) => {
        withFailureHandler: (callback: (error: any) => void) => {
          fetchSites: () => void;
        };
      };
    };
  };
};

interface AvailableSitesListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AvailableSitesList = ({ open, onOpenChange }: AvailableSitesListProps) => {
  const [search, setSearch] = useState("");
  const [sites, setSites] = useState<any[]>([]); // State for sites fetched from GAS
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [selectedSite, setSelectedSite] = useState<typeof sites[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      google.script.run
        .withSuccessHandler((response) => {
          if (response.success) {
            setSites(response.sites);
          } else {
            setError(response.message || "Failed to fetch sites.");
          }
          setLoading(false);
        })
        .withFailureHandler((err) => {
          console.error("Error fetching sites:", err);
          setError("An error occurred while fetching sites.");
          setLoading(false);
        })
        .fetchSites(); // GAS function to fetch sites
    }
  }, [open]);

  const filteredSites = sites.filter(site => 
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

  const handleSiteClick = (site: any) => {
    if (site.Lat && site.Lng) {
      console.log(`Site clicked: ${site["Site Name"]}, Lat: ${site.Lat}, Lng: ${site.Lng}`);
      setSelectedSite(site);
      setShowDetails(true);
    } else {
      console.warn("Selected site has no geolocation data.");
    }
  };

  const handleTransactionClick = () => {
    setShowTransactionModal(true);
    setShowDetails(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleMainDialogClose}>
        <DialogContent className="sm:max-w-[800px] z-50">
          <DialogHeader>
            <DialogTitle>使用可能現場一覧</DialogTitle>
            <DialogDescription>
              現場を選択して詳細を確認できます
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            { loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showDetails && selectedSite && (
        <SiteDetailsDialog
          site={selectedSite}
          open={showDetails}
          onOpenChange={setShowDetails}
          onTransactionClick={handleTransactionClick}
        />
      )}

      {showTransactionModal && (
        <TransactionRegistrationModal 
          open={showTransactionModal}
          onOpenChange={(open) => {
            setShowTransactionModal(open);
            if (!open) {
              handleMainDialogClose(false);
            }
          }}
        />
      )}
    </>
  );
};

export default AvailableSitesList;