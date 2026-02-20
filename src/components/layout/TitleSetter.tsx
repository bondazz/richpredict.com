"use client";

import { useEffect } from "react";
import { useTitle } from "@/context/TitleContext";

export default function TitleSetter({ title }: { title: string | null }) {
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle(title);
        // Reset title on unmount
        return () => setTitle(null);
    }, [title, setTitle]);

    return null;
}
