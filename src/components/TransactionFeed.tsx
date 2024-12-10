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

interface TransactionFeedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionFeed = ({ open, onOpenChange }: TransactionFeedProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>トランザクションフィード</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>種類</TableHead>
                <TableHead>現場名</TableHead>
                <TableHead>詳細</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Sample data - replace with actual data */}
              <TableRow>
                <TableCell>2024/02/28</TableCell>
                <TableCell>現場登録</TableCell>
                <TableCell>サンプル現場</TableCell>
                <TableCell>新規現場が登録されました</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFeed;