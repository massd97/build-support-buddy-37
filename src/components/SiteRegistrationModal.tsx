import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { CompanyType } from "@/types/site";
import SiteTypeSelector from "./site-registration/SiteTypeSelector";
import CompanySelector from "./site-registration/CompanySelector";
import CommonFields from "./site-registration/CommonFields";
import { toast } from "sonner";

interface SiteRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SiteRegistrationModal = ({ open, onOpenChange }: SiteRegistrationModalProps) => {
  const [siteType, setSiteType] = useState<"残土" | "客土">("残土");
  const [soilType, setSoilType] = useState("");
  const [otherSoilType, setOtherSoilType] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [company, setCompany] = useState<CompanyType>("OHD");
  const [formData, setFormData] = useState({
    siteName: "",
    address: "",
    contactPerson: "",
    email: "",
    startDate: "",
    endDate: "",
    dumpSize: "",
    smallTransport: "無",
    soilVolume: "",
    soilType: "",
    previousUse: "",
    requiredSoilVolume: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        siteType,
        soilType: soilType === "その他" ? otherSoilType : soilType,
        image: image ? await readFileAsBase64(image) : null,
        company,
      };

      google.script.run
        .withSuccessHandler((response: { success: boolean; id: string; message: string }) => {
          if (response.success) {
            toast.success("登録成功！ID: " + response.id);
            onOpenChange(false);
          } else {
            toast.error("登録失敗！");
          }
        })
        .withFailureHandler((error) => {
          console.error("Registration failed:", error);
          toast.error("登録失敗！");
        })
        .registerSite(payload);
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("登録中にエラーが発生しました");
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] p-0">
        <ScrollArea className="h-full p-6">
          <DialogHeader>
            <DialogTitle>現場新規登録（残土/客土）</DialogTitle>
            <DialogDescription>
              登録する現場の種類を選択してください
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <SiteTypeSelector value={siteType} onChange={setSiteType} />
            <CommonFields formData={formData} handleInputChange={handleInputChange} />
            <CompanySelector value={company} onChange={setCompany} />
          </div>
          
          <div className="sticky bottom-0 bg-background p-4 border-t">
            <Button className="w-full" onClick={handleSubmit}>登録</Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SiteRegistrationModal;