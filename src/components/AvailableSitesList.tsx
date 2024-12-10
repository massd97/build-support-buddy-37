import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface AvailableSitesListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AvailableSitesList = ({ open, onOpenChange }: AvailableSitesListProps) => {
  const [search, setSearch] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>使用可能現場一覧</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="検索 (住所、現場名、担当者名)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
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
              {/* Sample data - replace with actual data */}
              <TableRow>
                <TableCell>サンプル現場</TableCell>
                <TableCell>東京都渋谷区</TableCell>
                <TableCell>山田太郎</TableCell>
                <TableCell>100㎥</TableCell>
                <TableCell>砂質土</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailableSitesList;