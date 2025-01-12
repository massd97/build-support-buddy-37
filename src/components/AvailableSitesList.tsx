import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import TransactionRegistrationModal from "./TransactionRegistrationModal";
import SitesTable from "./SitesTable";
import SiteDetailsDialog from "./SiteDetailsDialog";
import EditSiteModal from "./EditSiteModal";
import SiteSearch from "./sites/SiteSearch";
import SiteDataLoader from "./sites/SiteDataLoader";

declare const google: {
  script: {
    run: {
      withSuccessHandler: <T>(callback: (response: T) => void) => {
        withFailureHandler: (callback: (error: any) => void) => {
          fetchSites: () => void;
          updateSite: (updatedSite: any) => void;
        };
      };
    };
  };
};

interface FetchSitesResponse {
  success: boolean;
  message?: string;
  sites: any[];
}

interface AvailableSitesListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AvailableSitesList = ({ open, onOpenChange }: AvailableSitesListProps) => {
  const [search, setSearch] = useState("");
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<typeof sites[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSites();
    }
  }, [open]);

  const fetchSites = () => {
    setLoading(true);
    setError(null);
    const decodeBase64 = (base64: string): string => {
      const binaryString = atob(base64);
      const binaryData = Uint8Array.from(binaryString, char => char.charCodeAt(0));
      return new TextDecoder("utf-8").decode(binaryData);
    };

    google.script.run
      .withSuccessHandler((compressedResponse: string) => {
        const decodeString = decodeBase64(compressedResponse);
        const response = JSON.parse(decodeString) as FetchSitesResponse;
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
      .fetchSites();
  };

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
      setSelectedSite(site);
      setShowDetails(true);
    }
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
            <SiteDataLoader loading={loading} error={error}>
              <>
                <SiteSearch value={search} onChange={setSearch} />
                <div className="max-h-[500px] overflow-y-auto">
                  <SitesTable 
                    sites={filteredSites}
                    onSiteClick={handleSiteClick}
                    onEditClick={(site) => {
                      setSelectedSite(site);
                      setShowEditModal(true);
                    }}
                  />
                </div>
              </>
            </SiteDataLoader>
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
          onEditClick={(site) => {
            setSelectedSite(site);
            setShowEditModal(true);
          }} 
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
            google.script.run
              .withSuccessHandler(() => {
                alert("現場が更新されました！");
                setSites((prevSites) =>
                  prevSites.map((site) =>
                    site.ID === updatedSite.ID ? updatedSite : site
                  )
                );
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