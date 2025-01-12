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
  id: string;
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
}

interface SitesTableProps {
  sites: Site[];
  onSiteClick: (site: Site) => void;
  onEditClick: (site: any) => void; 
}

const SitesTable = ({ sites, onSiteClick }: SitesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>種類</TableHead>
          <TableHead>現場名</TableHead>
          <TableHead>住所</TableHead>
          <TableHead>残土・客土申請可能期間開始</TableHead>
          <TableHead>残土・客土申請可能期間終了</TableHead>
          <TableHead>担当者</TableHead>
          <TableHead>残土の量</TableHead>
          <TableHead>土質</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sites.map((site) => (
          <TableRow
            key={site.id}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => onSiteClick(site)}
          >
            <TableCell>
              <Badge variant={site.siteType === "残土" ? "destructive" : "default"}>
                {site.siteType}
              </Badge>
            </TableCell>
            <TableCell>{site.siteName}</TableCell>
            <TableCell>{site.address}</TableCell>
            <TableCell>{site.startDate}</TableCell>
            <TableCell>{site.endDate}</TableCell>
            <TableCell>{site.contactPerson}</TableCell>
            <TableCell>{site.soilVolume}</TableCell>
            <TableCell>{site.soilType}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SitesTable;