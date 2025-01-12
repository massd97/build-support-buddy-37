import { Input } from "@/components/ui/input";

interface SiteSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const SiteSearch = ({ value, onChange }: SiteSearchProps) => {
  return (
    <Input
      placeholder="検索 (住所、現場名、担当者名)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mb-4"
    />
  );
};

export default SiteSearch;