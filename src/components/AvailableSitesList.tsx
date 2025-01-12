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
      withSuccessHandler: <T>(callback: (response: T) => void) => {
        withFailureHandler: (callback: (error: any) => void) => {
          fetchSites: () => void;
          updateSite: (updatedSite: any) => void; // Add this line
        };
      };
    };
  };
};

import EditSiteModal from "./EditSiteModal";

interface FetchSitesResponse {
  success: boolean;
  message?: string;
  sites: any[]; // Update the type of `sites` based on your data structure if needed
}

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
  const [showEditModal, setShowEditModal] = useState(false);
  
  const handleEditClick = (site: any) => {
    console.log("Edit clicked for site:", site);
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      const decodeBase64 = (base64: string): string => {
        const binaryString = atob(base64);
        const binaryData = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        return new TextDecoder("utf-8").decode(binaryData);
      };
      // If the search input matches an ID format, fetch by ID
      const isIdSearch = /^\w{8}(-\w{4}){3}-\w{12}$/.test(search); // UUID format
      const ids = isIdSearch ? [search] : [];
      
      google.script.run
        .withSuccessHandler((compressedResponse: string) => {
          const decodeString = decodeBase64(compressedResponse);
          const response = JSON.parse(decodeString) as FetchSitesResponse;
          console.log("Received response from GAS:", response);
          if (response.success) {
            setSites(response.sites);
          } else {
            setError(response.message || "Failed to fetch sites.");
          }
          console.log("Sites fetched:", response.sites);
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

  const filteredSites = sites.filter(site => {
    if (/^\d+$/.test(search)) {
      return (
        site.soilVolume >= parseInt(search, 10) ||
        site.requiredSoilVolume >= parseInt(search, 10)
      );
    }
    return (
      site.siteName.toLowerCase().includes(search.toLowerCase()) ||
      site.address.toLowerCase().includes(search.toLowerCase()) ||
      site.siteType.toLowerCase().includes(search.toLowerCase()) ||
      site.soilType.toLowerCase().includes(search.toLowerCase()) ||
      site.company.toLowerCase().includes(search.toLowerCase()) ||
      site.contactPerson.toLowerCase().includes(search.toLowerCase())
    );
  });

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
    if (site.lat && site.lng) {
      console.log(`Site clicked: ${site["siteName"]}, Lat: ${site.lat}, Lng: ${site.lng}`);
      setSelectedSite(site);
      setShowDetails(true);
    } else {
      console.warn("Selected site has no geolocation data.");
    }
  };

  const handleTransactionClick = (site: any) => {
    setSelectedSite(site); // Ensure selectedSite contains the relevant site data
    setShowTransactionModal(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleMainDialogClose}>
        <DialogContent className="w-full max-w-[900px] z-50">
          <DialogHeader>
            <DialogTitle>使用可能現場一覧</DialogTitle>
            <DialogDescription>
              現場を選択し、取引申請、現場情報編集又は詳細の確認を行ってください。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            { loading ? (
              <div>データ取得中...</div>
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
                <div className="max-h-[500px] overflow-y-auto">
                  <SitesTable 
                    sites={filteredSites}
                    onSiteClick={handleSiteClick}
                    onEditClick={handleEditClick}
                    />
                </div>
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
          onTransactionClick={(site) => {
            setSelectedSite(site); // Pass the site to be used in the modal
            setShowTransactionModal(true); // Open the transaction modal
          }}
          onEditClick={(site) => {
            setSelectedSite(site); // Set the site to be edited
            setShowEditModal(true); // Open edit modal
          }} 
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
          siteData={{
            ID: selectedSite.ID,
            soilType: selectedSite.siteType,
            requiredSoilVolume: selectedSite.requiredSoilVolume,
            siteName: selectedSite.siteName,
            address: selectedSite.address,
            email: selectedSite.email,
            contactPerson: selectedSite.contactPerson,
            soilVolume: selectedSite.soilVolume,
          }}
        />
      )}

      {showEditModal && selectedSite && (
        <EditSiteModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          site={selectedSite}
          onSave={(updatedSite) => {
            console.log("Updated site data being sent to GAS:", updatedSite);
            google.script.run
              .withSuccessHandler(() => {
                alert("現場が更新されました！");
                setSites((prevSites) =>
                  prevSites.map((site) =>
                    site.ID === updatedSite.ID ? updatedSite : site
                  )
                ); // Update the frontend state
              })
              .withFailureHandler((error) => {
                console.error("Error updating site:", error);
                alert("現場の更新中にエラーが発生しました。");
              })
              .updateSite(updatedSite); 
          }}
        />
      )}
    </>
  );
};

export default AvailableSitesList;