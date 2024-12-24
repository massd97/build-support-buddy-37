import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyType, SiteType } from "@/types/site";

interface SiteFiltersProps {
  company: CompanyType | "all";
  setCompany: (company: CompanyType | "all") => void;
  siteType: SiteType | "all";
  setSiteType: (type: SiteType | "all") => void;
  minSoilAmount: string;
  setMinSoilAmount: (amount: string) => void;
  soilType: string;
  setSoilType: (type: string) => void;
}

const SiteFilters = ({
  company,
  setCompany,
  siteType,
  setSiteType,
  minSoilAmount,
  setMinSoilAmount,
  soilType,
  setSoilType,
}: SiteFiltersProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="relative">
        <Label>施工会社</Label>
        <Select value={company} onValueChange={(value) => setCompany(value as CompanyType | "all")}>
          <SelectTrigger>
            <SelectValue placeholder="施工会社を選択" />
          </SelectTrigger>
          <SelectContent className="z-[60]">
            <SelectItem value="all">全て</SelectItem>
            <SelectItem value="OHD">OHD</SelectItem>
            <SelectItem value="Meldia">Meldia</SelectItem>
            <SelectItem value="HawkOne">HawkOne</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Label>残土/客土</Label>
        <Select value={siteType} onValueChange={(value) => setSiteType(value as SiteType | "all")}>
          <SelectTrigger>
            <SelectValue placeholder="残土か客土かを選択" />
          </SelectTrigger>
          <SelectContent className="z-[60]">
            <SelectItem value="all">全て</SelectItem>
            <SelectItem value="残土">残土</SelectItem>
            <SelectItem value="客土">客土</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>最小土量 (㎥)</Label>
        <Input
          type="number"
          value={minSoilAmount}
          onChange={(e) => setMinSoilAmount(e.target.value)}
          placeholder="最小土量を入力"
        />
      </div>

      <div className="relative">
        <Label>土質</Label>
        <Select value={soilType} onValueChange={setSoilType}>
          <SelectTrigger>
            <SelectValue placeholder="土質を選択" />
          </SelectTrigger>
          <SelectContent className="z-[60]">
            <SelectItem value="all">全て</SelectItem>
            <SelectItem value="黒土">黒土</SelectItem>
            <SelectItem value="赤土">赤土</SelectItem>
            <SelectItem value="砂質">砂質</SelectItem>
            <SelectItem value="粘土質">粘土質</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SiteFilters;