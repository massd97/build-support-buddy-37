import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Site {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  soilAmount: string;
  soilType: string;
  lat: number;
  lng: number;
  phone: string;
}

interface SitesTableProps {
  sites: Site[];
  onSiteClick: (site: Site) => void;
}

const SitesTable = ({ sites, onSiteClick }: SitesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>現場名</TableHead>
          <TableHead>住所</TableHead>
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
            <TableCell>{site.name}</TableCell>
            <TableCell>{site.address}</TableCell>
            <TableCell>{site.contactPerson}</TableCell>
            <TableCell>{site.soilAmount}</TableCell>
            <TableCell>{site.soilType}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SitesTable;