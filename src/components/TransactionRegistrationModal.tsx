import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
interface TransactionRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteData?: {
    siteName: string;
    address: string;
    contactPerson: string;
    soilVolume: number;
    email?: string; // Optional for pre-filling
    preferredDate?: string; // Optional for pre-filling
  };
}

declare const google: {
  script: {
    run: {
      withSuccessHandler: <T>(callback: (response: T) => void) => {
        withFailureHandler: (callback: (error: any) => void) => {
          registerTransaction: (payload: any) => void;
          fetchRequests: () => void;
          updateRequestStatus: (payload: any) => void;
        };
      };
    };
  };
};

const TransactionRegistrationModal = ({ open, onOpenChange, siteData }: TransactionRegistrationModalProps) => {
  const handleSubmit = () => {
    const payload = {
      type: "要求",
      siteName: siteData?.siteName || "",
      address: siteData?.address || "",
      preferredDate: (document.getElementById("preferredDate") as HTMLInputElement)?.value || "",
      requesterName: siteData?.contactPerson || "Unknown",
      soilVolume: siteData?.soilVolume || 0,
      email: siteData?.email || "",
      contactPerson: siteData?.contactPerson || "",
    };

    console.log("Submitting transaction payload:", payload);

    google.script.run
      .withSuccessHandler((response: { success: boolean; message: string }) => {
        if (response.success) {
          alert("取引が登録されました！");
          onOpenChange(false);
          window.location.href = window.location.href;
        } else {
          alert("取引登録中にエラーが発生しました: " + response.message);
        }
      })
      .withFailureHandler((error) => {
        console.error("Error registering transaction:", error);
        alert("取引登録中にエラーが発生しました。");
      })
      .registerTransaction(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>取引新規登録</DialogTitle>
        </DialogHeader>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>項目</TableHead>
                <TableHead>詳細</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>現場名</TableCell>
                <TableCell>{siteData?.siteName || "未設定"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>住所</TableCell>
                <TableCell>{siteData?.address || "未設定"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>担当者</TableCell>
                <TableCell>{siteData?.contactPerson || "未設定"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>連絡先</TableCell>
                <TableCell>{siteData?.email || "未設定"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>土の量</TableCell>
                <TableCell>{siteData?.soilVolume || 0}㎥</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        <div>
          <label htmlFor="preferredDate">受け取り希望日</label>
          <input id="preferredDate" type="date" />
        </div>
        </div>
        <Button onClick={handleSubmit}>登録</Button>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionRegistrationModal;