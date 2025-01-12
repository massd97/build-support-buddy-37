import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
interface TransactionRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteData?: {
    ID: string;
    siteName: string;
    soilType: string;
    address: string;
    contactPerson: string;
    soilVolume: number;
    requiredSoilVolume?: number;
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
        };
      };
    };
  };
};

const TransactionRegistrationModal = ({ open, onOpenChange, siteData }: TransactionRegistrationModalProps) => {
  
  const [siteName, setSiteName] = useState<string>(siteData?.siteName || "");
  const [address, setAddress] = useState<string>(siteData?.address || "");
  const [requiredSoilVolume, setRequiredSoilVolume] = useState<number>(siteData?.requiredSoilVolume || 0);
  const [contactPerson, setContactPerson] = useState<string>(siteData?.contactPerson || "Unknown");
  const [email, setEmail] = useState<string>(siteData?.email || "");
  
  const handleSubmit = () => {
    const payload = {
      ID: siteData?.ID || "",
      emailRecipient: siteData?.email || "",
      soilType: siteData?.soilType || "",
      zandoSiteName: siteData?.siteName || "",
      type: "要求",
      siteName,
      address,
      preferredDate: (document.getElementById("preferredDate") as HTMLInputElement)?.value || "",
      contactPerson,
      requiredSoilVolume,
      email,
    };

    console.log("Submitting transaction payload:", payload);

    google.script.run
      .withSuccessHandler((response: { success: boolean; id: string; message: string }) => {
        if (response.success) {
          alert("取引が登録されました！");
          onOpenChange(false);
          // window.location.href = window.location.href;
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
          <DialogTitle>入れ案件新規登録</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          取引申請する現場（客土）の情報を入力してください。
        </DialogDescription>
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>項目</TableHead>
                <TableHead>詳細</TableHead>
              </TableRow>
            </TableHeader>
            <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-md">
              <TableBody>
                <TableRow>
                  <TableCell>現場名(客土)</TableCell>
                  <TableCell>
                    <Input
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="客土現場名を入力してください"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>住所</TableCell>
                  <TableCell>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="客土現場の住所を入力してください"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>担当者</TableCell>
                  <TableCell>
                    <Input 
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="客土現場の担当者名を入力してください"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>取引申請者のメールアドレス</TableCell>
                  <TableCell>
                    <Input 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="取引申請者のメールアドレスを入力してください"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>必要土量(㎥)</TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      value={requiredSoilVolume}
                      onChange={(e) => setRequiredSoilVolume(Number(e.target.value))}
                      placeholder="必要な土の量を入力してください"
                      />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>受け取り希望日</TableCell>
                  <TableCell>
                    <Input id="preferredDate" type="date" 
                      placeholder="残土の受け取り希望日を入力してください"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </div>
          </Table>
        </div>
        <Button onClick={handleSubmit}>登録</Button>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionRegistrationModal;