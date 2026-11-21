"use client";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    confirmLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ open, title, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 text-center shadow-xl">
                <p className="font-bold text-text-main">{title}</p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl transition text-sm cursor-pointer"
                    >
                        {confirmLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 border border-border text-text-body font-semibold py-2.5 px-4 rounded-xl transition text-sm hover:bg-surface-hover cursor-pointer"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
}
