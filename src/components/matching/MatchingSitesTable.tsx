import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface MatchingSite {
  mainSite: {
    siteName: string;
  };
  matchedSite: {
    siteName: string;
  };
  distance: number;
}

interface MatchingSitesTableProps {
  matches: MatchingSite[];
  onMatchClick: (match: MatchingSite) => void;
}

const MatchingSitesTable = ({ matches, onMatchClick }: MatchingSitesTableProps) => {
  return (
    <div className="max-h-64 overflow-y-auto border border-gray-300 rounded">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>客土現場名</TableHead>
            <TableHead>残土現場名</TableHead>
            <TableHead>現場間の距離 (km)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match, index) => (
            <TableRow 
              key={index} 
              onClick={() => onMatchClick(match)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{match.mainSite.siteName}</TableCell>
              <TableCell>{match.matchedSite.siteName}</TableCell>
              <TableCell>{match.distance.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchingSitesTable;