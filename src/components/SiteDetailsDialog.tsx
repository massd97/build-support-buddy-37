import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Site {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  soilAmount: string;
  soilType: string;
  siteType: "残土" | "客土";
  lat: number;
  lng: number;
  phone: string;
}

interface SiteDetailsDialogProps {
  site: Site | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionClick: () => void;
}

const SiteDetailsDialog = ({
  site,
  open,
  onOpenChange,
  onTransactionClick,
}: SiteDetailsDialogProps) => {
  if (!site) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] z-[60]">
        <DialogHeader>
          <DialogTitle>現場詳細情報</DialogTitle>
          <DialogDescription>
            現場の詳細情報を確認できます
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg">{site.name}</h3>
              <Badge variant={site.siteType === "残土" ? "destructive" : "default"}>
                {site.siteType}
              </Badge>
            </div>
            <div className="space-y-2">
              <p><span className="font-semibold">住所:</span> {site.address}</p>
              <p><span className="font-semibold">残土の量:</span> {site.soilAmount}</p>
              <p><span className="font-semibold">土質:</span> {site.soilType}</p>
              <p><span className="font-semibold">担当者:</span> {site.contactPerson}</p>
              <p><span className="font-semibold">連絡先:</span> {site.phone}</p>
              <p><span className="font-semibold">位置情報:</span> {site.lat}, {site.lng}</p>
            </div>
            <Button 
              className="w-full mt-4"
              onClick={onTransactionClick}
            >
              取引を申請
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SiteDetailsDialog;