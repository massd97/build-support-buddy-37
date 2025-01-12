import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "./site-registration/SiteFormFields";
import { SiteTypeRadio } from "./site-registration/SiteTypeRadio";
import { ScrollArea } from "./ui/scroll-area";

declare const google: {
  script: {
    run: {
      withSuccessHandler: <T>(callback: (response: T) => void) => {
        withFailureHandler: (callback: (error: any) => void) => {
          registerSite: (payload: any) => void;
        };
      };
    };
  };
};

interface SiteRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SiteRegistrationModal = ({ open, onOpenChange }: SiteRegistrationModalProps) => {
  const [siteType, setSiteType] = useState<"残土" | "客土">("残土");
  const [soilType, setSoilType] = useState("");
  const [otherSoilType, setOtherSoilType] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [company, setCompany] = useState<"OHD" | "Meldia" | "HawkOne">("OHD");
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

  const handleDropdownChange = (id: string, value: string) => {
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

      console.log('image:', image);

      console.log("Base64 Image:", image ? await readFileAsBase64(image) : "No image");
  
      console.log("Submitting site data:", payload);
  
      google.script.run
        .withSuccessHandler((response: { success: boolean; id: string; message: string }) => {
          if (response.success) {
            console.log("Site registered successfully with ID:", response.id);
            alert("登録成功！ID: " + response.id);
            onOpenChange(false);
            setTimeout(() => {
              
            }, 500);
          } else {
            alert("登録失敗！");
          }
        })
        .withFailureHandler((error) => {
          console.error("Registration failed:", error);
          alert("登録失敗！");
        })
        .registerSite(payload);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log("Reading file as base64:", file);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      console.log("File read as base64:", reader.result);
    });
  };

  const commonFields = [
    { id: "siteName", label: "現場名", type: "text", required: true },
    { id: "address", label: "住所", type: "text", required: true },
    { id: "contactPerson", label: "担当者", type: "text", required: true },
    { id: "email", label: "連絡先", type: "email", required: true },
    { id: "startDate", label: "開始日", type: "date" },
    { id: "endDate", label: "終了日", type: "date" },
  ];

  const siteTypeSpecificFields =
    siteType === "残土"
      ? [
          { id: "dumpSize", label: "侵入可能最大ダンプサイズ（t）", type: "number" },
          { id: "soilVolume", label: "土量(㎡)", type: "number" },
          {
            id: "soilType",
            label: "土質",
            type: "dropdown",
            options: ["黒土", "赤土", "砂質", "粘土質", "その他"],
          },
          {
            id: "image",
            label: "残土の状態を示す画像",
            type: "file",
            accept: "image/*",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log("Selected file:", file);
                setImage(file);
              }else{
                console.log("No file selected");
              }
            },
          },
          { id: "smallTransport", label: "小型トラックの入場可否", type: "dropdown", options: ["有", "無"] },
          { id: "previousUse", label: "従前の用途", type: "text" },
        ]
      : [{ id: "requiredSoilVolume", label: "必要土量", type: "number" },
        {
          id: "soilType",
          label: "必要となる残土の土質",
          type: "dropdown",
          options: ["黒土", "赤土", "砂質", "粘土質", "その他"],
        },
      ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] p-0" style={{ zIndex: 9998 }}>
        <ScrollArea className="h-full p-6">
          <DialogHeader>
            <DialogTitle>現場新規登録（残土/客土）</DialogTitle>
            <DialogDescription>
              登録する現場の種類を選択してください
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <SiteTypeRadio value={siteType} onChange={setSiteType} />

            {commonFields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                formData={formData}
                handleInputChange={handleInputChange}
              />
            ))}

            {siteTypeSpecificFields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                formData={formData}
                handleInputChange={handleInputChange}
                handleDropdownChange={handleDropdownChange}
                setSoilType={setSoilType}
                setImage={setImage}
              />
            ))}

            <div className="grid gap-2">
              <Label htmlFor="company">施工会社</Label>
              <Select onValueChange={(value) => setCompany(value as "OHD" | "Meldia" | "HawkOne")}>
                <SelectTrigger>
                  <SelectValue placeholder="施工会社を選択してください" />
                </SelectTrigger>
                <SelectContent style={{ zIndex: 99999 }}>
                  <SelectItem value="OHD">OHD</SelectItem>
                  <SelectItem value="Meldia">Meldia</SelectItem>
                  <SelectItem value="HawkOne">HawkOne</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
