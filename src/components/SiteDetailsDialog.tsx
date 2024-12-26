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
  soilType: string;
  siteType: "残土" | "客土";
  lat: number;
  lng: number;
  email: string;
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
                <TableCell>土の量</TableCell>
                <TableCell>{site?.soilVolume || 0}㎥</TableCell>
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