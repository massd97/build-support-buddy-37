import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface TransactionRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionRegistrationModal = ({ open, onOpenChange }: TransactionRegistrationModalProps) => {
  const [type, setType] = useState<"要求" | "承認">("要求");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>取引新規登録</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={(value: "要求" | "承認") => setType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="要求">要求</SelectItem>
              <SelectItem value="承認">承認</SelectItem>
            </SelectContent>
          </Select>

          {type === "要求" ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="siteName">現場名</Label>
                <Input id="siteName" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">住所</Label>
                <Input id="address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preferredDate">受け取り希望日</Label>
                <Input id="preferredDate" type="date" />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">要求情報</h3>
                <p>現場: サンプル現場</p>
                <p>土の量: 100㎥</p>
                <p>要求者の連絡先: example@email.com</p>
                <p>要求者の受け取り希望日: 2024/03/01</p>
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="受諾">受諾</SelectItem>
                  <SelectItem value="拒否">拒否</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <Button className="w-full">登録</Button>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionRegistrationModal;