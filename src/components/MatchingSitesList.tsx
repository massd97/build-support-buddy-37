import { useState, useEffect } from "react";
import TransactionRegistrationModal from "./TransactionRegistrationModal";
import SitesTable from "./SitesTable";
import SiteDetailsDialog from "./SiteDetailsDialog";
import { on } from "events";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DialogDescription } from "@radix-ui/react-dialog";

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

const MatchingSitesList = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
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

  const fetchSites = async () => {
    setLoading(true);
    google.script.run
      .withSuccessHandler((compressedResponse: string) => {
        try {
          const decodedString = decodeBase64(compressedResponse);
          const response = JSON.parse(decodedString);
          console.log("Sites response:", response);

          if (response.success) {
            console.log("Sites fetched:", response.sites);
            const siteMap = response.sites.reduce((acc: Record<string, any>, site: any) => {
              acc[site.ID] = site; // Map sites by ID
              return acc;
            }, {});
            console.log("Site map:", siteMap);
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

  const fetchMatches = async () => {
    setLoading(true);
    google.script.run
      .withSuccessHandler((compressedResponse: string) => {
        try {
          const decodedString = decodeBase64(compressedResponse);
          const response = JSON.parse(decodedString);
          console.log("Matches response:", response);

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
      fetchSites(); // Fetch all sites first
    }
  }, [open]);

  useEffect(() => {
    if (Object.keys(sitesMap).length > 0) {
      fetchMatches(); // Fetch matches only after sites are fetched
    }
  }, [sitesMap]);

  const handleRowClick = (match: any) => {
    // Determine the 客土 site based on siteType
    const kyakuDoSite = match.mainSite.siteType === "客土" ? match.mainSite : match.matchedSite;

    setSelectedMatch({
      siteName: kyakuDoSite.siteName,
      address: kyakuDoSite.address || "N/A",
      contactPerson: kyakuDoSite.contactPerson || "Unknown",
      soilVolume: 0, // 客土 does not have soil available
      requiredSoilVolume: kyakuDoSite.requiredSoilVolume || 0,
    });
    setShowTransactionModal(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[900px]">
        <DialogHeader>
          <DialogTitle>マッチング一覧</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          現場間のマッチング一覧・・押下することで申請を行うことができます
        </DialogDescription>
          <ScrollArea className="h-full p-6">
            <div className="py-4">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) :  (
                <div
                  className="max-h-64 overflow-y-auto border border-gray-300 rounded"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>客土現場名</TableHead>
                        <TableHead>残土現場名</TableHead>
                        <TableHead>現場間の距離 (km)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matches.map((match, index) => (
                        <TableRow key={index} onClick={() => handleRowClick(match)}>
                          <TableCell>{match.mainSite.siteName}</TableCell>
                          <TableCell>{match.matchedSite.siteName}</TableCell>
                          <TableCell>{match.distance.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </ScrollArea>
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