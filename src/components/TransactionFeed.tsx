import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { CommandSeparator } from "cmdk";
interface TransactionFeedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

declare const google: {
  script: {
    run: {
      withSuccessHandler: <T>(callback: (response: T) => void) => {
        withFailureHandler: (callback: (error: any) => void) => {
          fetchTransactions: (ids?: string[]) => void; // Accept an optional array of IDs
          updateTransactionStatus: (payload: { id: string; zandoSiteID: string; status: "受諾" | "拒否" }) => void;
        };
      };
    };
  };
};


const TransactionFeed = ({ open, onOpenChange }: TransactionFeedProps) => {

  const [transactions, setTransactions] = useState<any[]>([]); // Transactions data
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]); // Filtered data
  const [search, setSearch] = useState(""); // Search input
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const fetchTransactions = (ids: string[] = []) => {
    setLoading(true);
    setError(null);
    const decodeBase64 = (base64: string): string => {
      const binaryString = atob(base64);
      const binaryData = Uint8Array.from(binaryString, char => char.charCodeAt(0));
      return new TextDecoder("utf-8").decode(binaryData);
    };
    console.log('fetching transactions...');
    google.script.run
      .withSuccessHandler((compressedResponse: string) => {
        try {
          // Decode the base64 response
          const decodedString = decodeBase64(compressedResponse);
          const response = JSON.parse(decodedString);
          console.log("Decoded response from GAS:", response);
  
          if (response.success) {
            setTransactions(response.transactions);
            setFilteredTransactions(response.transactions);
          } else {
            setError(response.message || "Failed to fetch transactions.");
          }
        } catch (error) {
          console.error("Error decoding response:", error);
          setError("Invalid response format from server.");
        }
        setLoading(false);
      })
      .withFailureHandler((err) => {
        console.error("Error fetching transactions:", err);
        setError("An error occurred while fetching transactions.");
        setLoading(false);
      })
      .fetchTransactions(ids);
  };
  

  // Handle transaction status update (受諾 or 拒否)
  const updateStatus = (transaction: any, status: "受諾" | "拒否") => {
    console.log(`Updating transaction status for transaction:`, transaction);
  
    const payload = {
      ...transaction, // Include all transaction details
      status,         // Add the updated status
    };
  
    google.script.run
      .withSuccessHandler((response: { success: boolean; message: string }) => {
        console.log("Transaction status update response:", response);
        if (response.success) {
          alert(`Transaction status updated to ${status}.`);
          fetchTransactions(); // Refresh transactions after update
        } else {
          alert("Failed to update transaction status: " + response.message);
        }
      })
      .withFailureHandler((error) => {
        console.error("Error updating transaction status:", error);
        alert("An error occurred while updating transaction status.");
      })
      .updateTransactionStatus(payload);
  };  

  useEffect(() => {
    if (open) fetchTransactions();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>取引一覧</DialogTitle>
        </DialogHeader>
        <div className="py-4">
        <Input
            placeholder="検索 (現場名、土質、詳細)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div
              className="max-h-64 overflow-y-auto border border-gray-300 rounded"
            >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>受け取り希望日</TableHead>
                  <TableHead>必要土量(㎡)</TableHead>
                  {/* <TableHead>取引の種類</TableHead> */}
                  <TableHead>残土現場名</TableHead>
                  <TableHead>客土現場名</TableHead>
                  <TableHead>住所</TableHead>
                  <TableHead>取引ステータス</TableHead>
                  <TableHead>取引内容</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.ID}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.soilVolume}</TableCell>
                    {/* <TableCell>{transaction.type}</TableCell> */}
                    <TableCell>{transaction.zandoSiteName}</TableCell>
                    <TableCell>{transaction.siteName}</TableCell>
                    <TableCell>{transaction.address}</TableCell>
                    <TableCell>{transaction.Status}</TableCell>
                    <TableCell>
                    {transaction.Status === "ペンディング中" ? (
                        transaction.type === "要求" ? (
                          <div className="flex space-x-2">
                            <Button onClick={() => updateStatus(transaction, "受諾")}>
                              受諾
                            </Button>
                            <Button onClick={() => updateStatus(transaction, "拒否")}>
                              拒否
                            </Button>
                          </div>
                        ) : (
                          <span>{transaction.type}</span> // No action for other types
                        )
                    ) : (
                        transaction.Status
                    )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default TransactionFeed;