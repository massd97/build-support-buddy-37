import * as React from "react";
import { Input } from "@/components/ui/input";

interface LabeledInputProps extends React.ComponentProps<"input"> {
  label: string;
  id: string;
}

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ label, id, className, type, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <Input id={id} type={type} className={className} ref={ref} {...props} />
      </div>
    );
  }
);

LabeledInput.displayName = "LabeledInput";

export { LabeledInput };