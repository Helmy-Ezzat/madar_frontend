import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

interface RadioProps extends ComponentProps<"input"> {
  label?: string;
}

export default function Radio({ className, label, checked = false, onChange, ...props }: RadioProps) {
  return (
    <label className="relative flex items-center cursor-pointer gap-2" onClick={(e) => e.stopPropagation()}>
      <input
        type="radio"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        {...props}
      />

      <div
        className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ease-in-out peer-checked:border-primary bg-transparent border-gray-300", className)}
      >
        {checked && (
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        )}
      </div>
      
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
