import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SiteTypeRadioProps {
  value: "残土" | "客土";
  onChange: (value: "残土" | "客土") => void;
}

export const SiteTypeRadio = ({ value, onChange }: SiteTypeRadioProps) => {
  return (
    <RadioGroup
      defaultValue={value}
      onValueChange={(value) => onChange(value as "残土" | "客土")}
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
  );
};