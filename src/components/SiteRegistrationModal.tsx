import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Declare the google object with the script property
declare const google: {
  script: {
    run: {
      withSuccessHandler: (callback: () => void) => {
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
    managerName: "",
    email: "",
    startDate: "",
    endDate: "",
    dumpSize: "",
    smallTransport: "無",
    soilVolume: "",
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
        image: image ? await readFileAsBase64(image) : null, // Convert image to Base64 for backend
        company,
      };

      console.log("Submitting site data:", payload);

      // Call backend function (e.g., google.script.run)
      google.script.run
        .withSuccessHandler(() => {
          alert("登録成功！");
          onOpenChange(false); // Close the modal
        })
        .withFailureHandler((error) => {
          console.error("Registration failed:", error);
          alert("登録失敗！");
        })
        .registerSite(payload); // Backend function to handle registration
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Define form fields
  const commonFields = [
    { id: "siteName", label: "現場名", type: "text", required: true },
    { id: "address", label: "住所", type: "text", required: true },
    { id: "managerName", label: "担当者", type: "text", required: true },
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
          { id: "previousUse", label: "従前の用途", type: "text" },
        ]
      : [{ id: "requiredSoilVolume", label: "必要土量", type: "number" }];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto z-[100]">
        <DialogHeader>
          <DialogTitle>現場新規登録（残土/客土）</DialogTitle>
          <DialogDescription>
            登録する現場の種類を選択してください
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <RadioGroup
            defaultValue="残土"
            onValueChange={(value) => setSiteType(value as "残土" | "客土")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="残土" id="残土" />
              <Label htmlFor="残土">残土</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="客土" id="客土" />
              <Label htmlFor="客土">客土</Label>
            </div>
          </RadioGroup>

          {/* Common Fields */}
          {commonFields.map((field) => (
            <div className="grid gap-2" key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                value={formData[field.id]}
                onChange={handleInputChange}
                required={field.required}
              />
            </div>
          ))}

          {/* Site-Type-Specific Fields */}
          {siteTypeSpecificFields.map((field) =>
            field.type === "dropdown" ? (
              <div className="grid gap-2" key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Select
                  onValueChange={(value) => {
                    if (field.id === "soilType") setSoilType(value);
                    handleDropdownChange(field.id, value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`${field.label}を選択してください`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-2" key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type}
                  value={formData[field.id]}
                  onChange={handleInputChange}
                />
              </div>
            )
          )}

          {/* Image Upload */}
          <div className="grid gap-2">
            <Label htmlFor="image">画像添付</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          {/* Company */}
          <div className="grid gap-2">
            <Label htmlFor="company">施工会社</Label>
            <Select
              onValueChange={(value) => setCompany(value as "OHD" | "Meldia" | "HawkOne")}
            >
              <SelectTrigger>
                <SelectValue placeholder="施工会社を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OHD">OHD</SelectItem>
                <SelectItem value="Meldia">Meldia</SelectItem>
                <SelectItem value="HawkOne">HawkOne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="w-full" onClick={handleSubmit}>登録</Button>
      </DialogContent>
    </Dialog>
  );
};

export default SiteRegistrationModal;
