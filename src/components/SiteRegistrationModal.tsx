import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
            <Label htmlFor="address">住所</Label>
            <Input id="address" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="soilAmount">残土の量</Label>
            <Input id="soilAmount" type="number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="soilType">土質</Label>
            <Input id="soilType" />
          </div>
          <div className="grid gap-2">
            <Label>期間</Label>
            <div className="flex gap-2 items-center">
              <Input type="date" id="startDate" className="flex-1" />
              <span className="text-sm">～</span>
              <Input type="date" id="endDate" className="flex-1" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact">担当者連絡先</Label>
            <Input id="contact" type="email" />
          </div>
          <div className="grid gap-2">
            <Label>小運搬有無</Label>
            <RadioGroup defaultValue="無">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="有" id="transport-yes" />
                <Label htmlFor="transport-yes">有</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="無" id="transport-no" />
                <Label htmlFor="transport-no">無</Label>
              </div>
            </RadioGroup>
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