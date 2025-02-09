import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LabeledInput } from "./ui/labeledInput";

interface EditSiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site: any;
  onSave: (updatedSite: any) => void;
}

const EditSiteModal = ({ open, onOpenChange, site, onSave }: EditSiteModalProps) => {
  const [formData, setFormData] = useState(site);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>現場編集</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <LabeledInput
            id="siteName"
            label="現場名"
            placeholder="現場名"
            value={formData.siteName}
            onChange={(e) => handleChange("siteName", e.target.value)}
          />
          <LabeledInput
            id="address"
            label="住所"
            placeholder="住所"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
          <LabeledInput
            id="company"
            label="施工会社"
            placeholder="担当者"
            value={formData.contactPerson}
            onChange={(e) => handleChange("contactPerson", e.target.value)}
          />
          <LabeledInput
            id="email"
            label="担当者連絡先"
            placeholder="担当者連絡先"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <LabeledInput
            id="siteType"
            label="現場の種類"
            placeholder="土質"
            value={formData.soilType}
            onChange={(e) => handleChange("soilType", e.target.value)}
          />
          <LabeledInput
            id="soilVolume"
            label="土の量"
            placeholder="土の量"
            type="number"
            value={formData.soilVolume}
            onChange={(e) => handleChange("soilVolume", parseFloat(e.target.value))}
          />
          <Button onClick={handleSave} className="w-full">
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSiteModal;
