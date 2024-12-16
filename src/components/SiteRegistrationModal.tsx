import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SiteRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SiteRegistrationModal = ({ open, onOpenChange }: SiteRegistrationModalProps) => {
  const [siteType, setSiteType] = useState<"残土" | "客土">("残土");
  const [soilType, setSoilType] = useState("");
  const [otherSoilType, setOtherSoilType] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [company, setCompany] = useState<"OHD" | "Meldia" | "HawkOne">("OHD");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>現場新規登録（残土/客土）</DialogTitle>
          <DialogDescription>
            登録する現場の種類を選択してください
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <RadioGroup
            defaultValue="残土"
            onValueChange={(value) => setSiteType(value as "残土" | "客土")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="残土" id="残土" />
              <Label htmlFor="残土">残土</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="客土" id="客土" />
              <Label htmlFor="客土">客土</Label>
            </div>
          </RadioGroup>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="company">担当会社</Label>
              <Select onValueChange={(value) => setCompany(value as typeof company)}>
                <SelectTrigger>
                  <SelectValue placeholder="担当会社を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OHD">OHD</SelectItem>
                  <SelectItem value="Meldia">Meldia</SelectItem>
                  <SelectItem value="HawkOne">HawkOne</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="siteName">現場名</Label>
              <Input id="siteName" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">住所</Label>
              <Input id="address" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="managerName">担当者</Label>
              <Input id="managerName" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">連絡先</Label>
              <Input id="email" type="email" />
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
              <Label htmlFor="dumpSize">侵入可能最大ダンプサイズ（t）</Label>
              <Input id="dumpSize" type="number" />
            </div>

            <div className="grid gap-2">
              <Label>小運搬有無</Label>
              <RadioGroup defaultValue="無" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="有" id="有" />
                  <Label htmlFor="有">有</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="無" id="無" />
                  <Label htmlFor="無">無</Label>
                </div>
              </RadioGroup>
            </div>

            {siteType === "残土" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="soilVolume">土量(㎡)</Label>
                  <Input id="soilVolume" type="number" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="soilType">土質</Label>
                  <Select onValueChange={setSoilType}>
                    <SelectTrigger>
                      <SelectValue placeholder="土質を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="黒土">黒土</SelectItem>
                      <SelectItem value="赤土">赤土</SelectItem>
                      <SelectItem value="砂質">砂質</SelectItem>
                      <SelectItem value="粘土質">粘土質</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {soilType === "その他" && (
                  <div className="grid gap-2">
                    <Label htmlFor="otherSoilType">その他の土質を記入</Label>
                    <Input
                      id="otherSoilType"
                      value={otherSoilType}
                      onChange={(e) => setOtherSoilType(e.target.value)}
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="previousUse">従前の用途</Label>
                  <Input id="previousUse" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">画像添付</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="requiredSoilVolume">必要土量</Label>
                <Input id="requiredSoilVolume" type="number" />
              </div>
            )}
          </div>
        </div>
        <Button className="w-full">登録</Button>
      </DialogContent>
    </Dialog>
  );
};

export default SiteRegistrationModal;
