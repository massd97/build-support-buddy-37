import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormFieldProps {
  field: {
    id: string;
    label: string;
    type: string;
    required?: boolean;
    options?: string[];
    accept?: string;
  };
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDropdownChange?: (id: string, value: string) => void;
  setSoilType?: (value: string) => void;
  setImage?: (file: File | null) => void;
}

export const FormField = ({ field, formData, handleInputChange, handleDropdownChange, setSoilType, setImage}: FormFieldProps) => {
  
  if (field.type === "dropdown") {
    return (
      <div className="grid gap-2">
        <Label htmlFor={field.id}>{field.label}</Label>
        <Select
          onValueChange={(value) => {
            if (field.id === "soilType" && setSoilType) setSoilType(value);
            if (handleDropdownChange) handleDropdownChange(field.id, value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={`${field.label}を選択してください`} />
          </SelectTrigger>
          <SelectContent style={{ zIndex: 99999 }}>
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === "file") {
    console.log("Rendering file input field");
    return (
      <div className="grid gap-2">
        <Label htmlFor={field.id}>{field.label}</Label>
        <Input
          id={field.id}
          type="file"
          accept={field.accept}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file && setImage) {
              console.log("Selected file:", file); // Log the selected file for debugging
              setImage(file); // Pass the file to parent state
            } else {
              console.log("No file selected");
              if (setImage) setImage(null); // Clear image if no file selected
            }
          }}
          required={field.required}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={field.id}>{field.label}</Label>
      <Input
        id={field.id}
        type={field.type}
        value={formData[field.id]}
        onChange={handleInputChange}
        required={field.required}
      />
    </div>
  );
};