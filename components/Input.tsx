import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
    startAccessory?: ReactElement;
}

export default function Input({ className, startAccessory, ...props }: InputProps) {
    return (
        <div className="relative w-full max-w-full border border-icon-bg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary rounded-r-[4px]">
            <input
                {...props}
                className={cn("rounded-[4px] px-3 py-2 truncate min-w-0 max-w-full w-full outline-none placeholder:text-slate-400/50", startAccessory !== undefined ? "ps-10" : "", className)}
            />
            {startAccessory ? (
                <>{startAccessory}</>
            ) : null}
        </div>
    )
}