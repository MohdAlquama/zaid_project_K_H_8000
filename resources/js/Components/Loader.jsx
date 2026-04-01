// components/Loader.jsx
"use client";

import { Loader2 } from "lucide-react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span>{message}</span>
    </div>
  );
}