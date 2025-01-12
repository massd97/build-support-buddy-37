import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Site {
  id: string;
  siteName: string;
  address: string;
  contactPerson: string;
  soilVolume: string;
  requiredSoilVolume: string;
  soilType: string;
  siteType: "残土" | "客土";
  lat: number;
  lng: number;
  email: string;
  company: string;
  previousUse: string;
  imageLink: string;
  startDate: string;
  endDate: string;
  dumpSize: string;
  smallTransport: "無" | "有";
}

interface SiteDetailsDialogProps {
  site: Site | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionClick: (site: Site) => void;
  onEditClick: (site: Site) => void; // Ensure this is defined
}

interface SiteDetailsDialogProps {
  site: Site | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionClick: (site: Site) => void; // Update to accept a Site parameter
}

const SiteDetailsDialog = ({ site, open, onOpenChange, onTransactionClick, onEditClick }: SiteDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>現場詳細</DialogTitle>
        </DialogHeader>
        <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-md">
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
                  <TableCell>{site?.siteName || "未設定"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>住所</TableCell>
                  <TableCell>{site?.address || "未設定"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>担当者</TableCell>
                  <TableCell>{site?.contactPerson || "未設定"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>連絡先</TableCell>
                  <TableCell>{site?.email || "未設定"}</TableCell>
                </TableRow>
                {site.siteType === "残土" ? (
                <TableRow>
                  <TableCell>残土量</TableCell>
                  <TableCell>{site?.soilVolume || 0}㎥</TableCell>
                </TableRow>
                ) : (
                <TableRow>
                  <TableCell>必要な残土量</TableCell>
                  <TableCell>{site?.requiredSoilVolume || 0}㎥</TableCell>
                </TableRow>
                )}
                <TableRow>
                  <TableCell>土質</TableCell>
                  <TableCell>{site?.soilType || "未設定"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>施工会社</TableCell>
                  <TableCell>{site?.company || "未設定"}</TableCell>
                  </TableRow>
                <TableRow>
                  <TableCell>現場開始日</TableCell>
                  <TableCell>{site?.startDate || "未設定"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>現場終了日</TableCell>
                  <TableCell>{site?.endDate || "未設定"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>祷善の用途</TableCell>
                  <TableCell>{site?.previousUse || "未設定"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>侵入可能最大ダンプサイズ（t）</TableCell>
                  <TableCell>{site?.dumpSize || "未設定"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>小型トラック</TableCell>
                  <TableCell>{site?.smallTransport || "未設定"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>残土の状態</TableCell>
                  <TableCell>
                    {site?.imageLink ? (
                      <a
                        href={site.imageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        画像を見る
                      </a>
                    ) : (
                      "画像のリンクは登録されていません"
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
          </Table>
          <Button onClick={() => site && onTransactionClick(site)} className="w-1/2"
            >取引申請
          </Button>
          <Button onClick={() => site && onEditClick(site)} className="w-1/2">
              編集
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SiteDetailsDialog;