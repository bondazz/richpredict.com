import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--fs-bg)]">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--fs-yellow)]" />
        </div>
    );
}
