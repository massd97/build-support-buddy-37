import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SiteRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SiteRegistrationModal = ({ open, onOpenChange }: SiteRegistrationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>現場新規登録</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="siteName">現場名</Label>
            <Input id="siteName" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="managerName">担当名</Label>
            <Input id="managerName" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">担当者連絡先</Label>
            <Input id="email" type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">住所</Label>
            <Input id="address" />
          </div>
          <div className="grid gap-2">
            <Label>工事期間</Label>
            <div className="flex gap-2 items-center">
              <Input type="date" id="startDate" className="flex-1" />
              <span className="text-sm">～</span>
              <Input type="date" id="endDate" className="flex-1" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dumpSize">侵入可能最大ダンプサイズ</Label>
            <Input id="dumpSize" />
          </div>
        </div>
        <Button className="w-full">登録</Button>
      </DialogContent>
    </Dialog>
  );
};

export default SiteRegistrationModal;