import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

export default function FloatingInput({ id, label, ...props }: Props) {
  return (
    <div className="relative">
      <input
        id={id}
        placeholder=" "
        {...props}
        className="peer w-full rounded-md border border-gray-400 bg-transparent px-4 py-4 text-text-main outline-none transition-colors
                   hover:border-text-main
                   focus:border-2 focus:border-primary focus:px-[15px] focus:py-[15px]"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute right-3 top-1/2 origin-right -translate-y-1/2 bg-white px-1 text-text-muted
                   transition-all duration-200 ease-out
                   peer-focus:top-0 peer-focus:scale-75 peer-focus:text-primary
                   peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-75"
      >
        {label}
      </label>
    </div>
  );
}