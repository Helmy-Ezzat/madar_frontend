import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

interface CheckboxProps extends Omit<ComponentProps<"input">, "checked"> {
  checked: "indeterminate" | boolean;
}

export default function Checkbox({ className, checked = false, onChange, ...props }: CheckboxProps) {
  return (
    <label className="relative flex items-center cursor-pointer focus-within:ring-2 rounded-lg" onClick={(e) => e.stopPropagation()}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked === "indeterminate" ? true : checked}
        onChange={onChange}
        {...props}
      />

      <div
        className={cn("w-5.5 h-5.5 rounded-lg border flex items-center justify-center transition-all duration-200 ease-in-out peer-checked:bg-primary2 peer-checked:border-primary2 bg-transparent border-gray-300", className)}
      >
        {checked === true && (
          <svg
            className="w-5 h-5 stroke-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {checked === "indeterminate" ? (
          <svg
            className="w-5 h-5 stroke-white fill-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="6" y="11" width="12" height="2" />
          </svg>
        ) : null}
      </div>
    </label>
  );
};