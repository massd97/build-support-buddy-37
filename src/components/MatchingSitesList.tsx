import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import TransactionRegistrationModal from "./TransactionRegistrationModal";
import MatchingSitesTable from "./matching/MatchingSitesTable";
import MatchingDataLoader from "./matching/MatchingDataLoader";

interface MatchingSitesListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

declare const google: {
  script: {
    run: {
      withSuccessHandler: <T>(callback: (response: T) => void) => {
        withFailureHandler: (callback: (error: any) => void) => {
          fetchMatchingSites: () => void;
          fetchSites: () => void;
        };
      };
    };
  };
};

const MatchingSitesList = ({ open, onOpenChange }: MatchingSitesListProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [sitesMap, setSitesMap] = useState<Record<string, any>>({});
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  const decodeBase64 = (base64: string): string => {
    const binaryString = atob(base64);
    const binaryData = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8").decode(binaryData);
  };

  const fetchSites = () => {
    setLoading(true);
    google.script.run
      .withSuccessHandler((compressedResponse: string) => {
        try {
          const decodedString = decodeBase64(compressedResponse);
          const response = JSON.parse(decodedString);
          if (response.success) {
            const siteMap = response.sites.reduce((acc: Record<string, any>, site: any) => {
              acc[site.ID] = site;
              return acc;
            }, {});
            setSitesMap(siteMap);
          } else {
            toast.error(response.message || "Failed to fetch sites");
          }
        } catch (err) {
          console.error("Error decoding sites response:", err);
          toast.error("Failed to decode sites response");
        }
        setLoading(false);
      })
      .withFailureHandler((err) => {
        console.error("Error fetching sites:", err);
        toast.error("Failed to fetch sites");
        setLoading(false);
      })
      .fetchSites();
  };

  const fetchMatches = () => {
    setLoading(true);
    google.script.run
      .withSuccessHandler((compressedResponse: string) => {
        try {
          const decodedString = decodeBase64(compressedResponse);
          const response = JSON.parse(decodedString);
          if (response.success) {
            const enrichedMatches = response.matches.map((match: any) => ({
              mainSite: sitesMap[match.mainSiteID] || {},
              matchedSite: sitesMap[match.matchedSiteID] || {},
              distance: match.Distance,
            }));
            setMatches(enrichedMatches);
          } else {
            toast.error(response.message || "Failed to fetch matches");
          }
        } catch (err) {
          console.error("Error decoding matches response:", err);
          toast.error("Failed to decode matches response");
        }
        setLoading(false);
      })
      .withFailureHandler((err) => {
        console.error("Error fetching matches:", err);
        toast.error("Failed to fetch matches");
        setLoading(false);
      })
      .fetchMatchingSites();
  };

  useEffect(() => {
    if (open) {
      fetchSites();
    }
  }, [open]);

  useEffect(() => {
    if (Object.keys(sitesMap).length > 0) {
      fetchMatches();
    }
  }, [sitesMap]);

  const handleMatchClick = (match: any) => {
    const kyakuDoSite = match.mainSite.siteType === "客土" ? match.mainSite : match.matchedSite;
    setSelectedMatch({
      siteName: kyakuDoSite.siteName,
      address: kyakuDoSite.address || "N/A",
      contactPerson: kyakuDoSite.contactPerson || "Unknown",
      soilVolume: 0,
      requiredSoilVolume: kyakuDoSite.requiredSoilVolume || 0,
    });
    setShowTransactionModal(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[900px]">
        <DialogHeader>
          <DialogTitle>マッチング一覧</DialogTitle>
          <DialogDescription>
            現場間のマッチング一覧・・押下することで申請を行うことができます
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <MatchingDataLoader loading={loading} error={error}>
            <MatchingSitesTable 
              matches={matches}
              onMatchClick={handleMatchClick}
            />
          </MatchingDataLoader>
        </div>
      </DialogContent>
      {selectedMatch && (
        <TransactionRegistrationModal
          open={showTransactionModal}
          onOpenChange={setShowTransactionModal}
          siteData={selectedMatch}
        />
      )}
    </Dialog>
  );
};

export default MatchingSitesList;