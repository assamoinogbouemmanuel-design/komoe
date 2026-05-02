"use client";

import { X } from "lucide-react";
import { Button } from "./Button";
import { useEffect } from "react";

export function Drawer({ isOpen, onClose, title, children }: any) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-primary/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl h-full bg-card shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-border flex justify-between items-center bg-card">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">{title}</h2>
          <Button variant="ghost" onClick={onClose} className="rounded-full p-2 h-10 w-10 text-muted-foreground hover:text-foreground">
            <X size={20} />
          </Button>
        </div>
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
