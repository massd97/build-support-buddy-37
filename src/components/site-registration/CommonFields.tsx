import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CommonFieldsProps {
  formData: {
    siteName: string;
    address: string;
    contactPerson: string;
    email: string;
    startDate: string;
    endDate: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CommonFields = ({ formData, handleInputChange }: CommonFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="siteName">現場名</Label>
        <Input
          id="siteName"
          value={formData.siteName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">住所</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contactPerson">担当者</Label>
        <Input
          id="contactPerson"
          value={formData.contactPerson}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">連絡先</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="startDate">開始日</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="endDate">終了日</Label>
        <Input
          id="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default CommonFields;