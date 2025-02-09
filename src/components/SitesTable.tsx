import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Site {
  ID: string;
  siteName: string;
  address: string;
  contactPerson: string;
  startDate: "";
  endDate: "";
  dumpSize: string;
  smallTransport: "無" | "有";
  soilVolume: string;
  soilType: string;
  siteType: "残土" | "客土";
  lat: number;
  lng: number;
  email: string;
  company: string;
  previousUse: string;
  imageLink: string;
  requiredSoilVolume: string;
}

interface SitesTableProps {
  sites: Site[];
  onSiteClick: (site: Site) => void;
  onEditClick: (site: any) => void; 
}

const formatDate = (isoDate: string): string => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD
};

const SitesTable = ({ sites, onSiteClick }: SitesTableProps) => {
  return (
    <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>種類</TableHead>
            <TableHead>現場名</TableHead>
            <TableHead>住所</TableHead>
            <TableHead>現場開始期間</TableHead>
            <TableHead>現場終了期間</TableHead>
            <TableHead>担当者</TableHead>
            <TableHead>残土の量</TableHead>
            <TableHead>土質</TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
            {sites.map((site) => (
              <TableRow
                key={site.ID}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => onSiteClick(site)}
              >
                <TableCell>
                  <Badge className={site.siteType === "残土" ? "bg-blue-500 text-white" : "bg-red-500 text-white"}
                    >
                      {site.siteType}
                  </Badge>
                </TableCell>
                <TableCell>{site.siteName}</TableCell>
                <TableCell>{site.address}</TableCell>
                <TableCell>{formatDate(site.startDate)}</TableCell>
                <TableCell>{formatDate(site.endDate)}</TableCell>
                <TableCell>{site.contactPerson}</TableCell>
                <TableCell>{site.soilVolume}</TableCell>
                <TableCell>{site.soilType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
      </Table>
    </div>
  );
};

export default SitesTable;