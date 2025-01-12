import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanyType } from "@/types/site";

interface CompanySelectorProps {
  value: CompanyType;
  onChange: (value: CompanyType) => void;
}

const CompanySelector = ({ value, onChange }: CompanySelectorProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="company">施工会社</Label>
      <Select onValueChange={(value) => onChange(value as CompanyType)}>
        <SelectTrigger>
          <SelectValue placeholder="施工会社を選択してください" />
        </SelectTrigger>
        <SelectContent style={{ zIndex: 99999 }}>
          <SelectItem value="OHD">OHD</SelectItem>
          <SelectItem value="Meldia">Meldia</SelectItem>
          <SelectItem value="HawkOne">HawkOne</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelector;