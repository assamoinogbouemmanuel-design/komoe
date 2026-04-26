"use client";

import { Eye, FileText, Download, X } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";

interface DocumentPreviewProps {
  fileName: string;
  fileSize?: string;
  type?: 'pdf' | 'image' | 'doc';
  onDownload?: () => void;
}

export function DocumentPreview({ fileName, fileSize = "2.4 MB", type = 'pdf', onDownload }: DocumentPreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-brand-blue/30 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-brand-orange">
            <FileText size={24} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900">{fileName}</p>
            <p className="text-xs text-slate-500">{fileSize} • {type.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(true)} className="gap-2">
            <Eye size={16} /> <span className="hidden sm:inline">Aperçu</span>
          </Button>
          {onDownload && (
            <Button size="sm" onClick={onDownload} className="bg-brand-blue hover:bg-[#000060] text-white gap-2">
              <Download size={16} /> <span className="hidden sm:inline">Télécharger</span>
            </Button>
          )}
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 flex flex-col animate-in fade-in duration-200">
          <div className="p-4 flex justify-between items-center bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <FileText />
              <span className="font-medium">{fileName}</span>
            </div>
            <div className="flex items-center gap-4">
              {onDownload && (
                <Button variant="ghost" size="sm" onClick={onDownload} className="text-white hover:bg-white/10 gap-2">
                  <Download size={16} /> Télécharger l'original
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(false)} className="text-white hover:bg-red-500/20 hover:text-red-400">
                <X size={24} />
              </Button>
            </div>
          </div>
          <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
            {/* Simuler le rendu PDF ou Image */}
            <div className="w-full max-w-4xl min-h-[800px] bg-white rounded-sm shadow-2xl p-12 flex flex-col items-center justify-center text-slate-400 border-t-8 border-brand-blue">
              <FileText size={64} className="mb-4 text-slate-200" />
              <p className="text-xl font-medium text-slate-800">Aperçu du document sécurisé</p>
              <p className="text-sm mt-2">Ce document est scellé par la blockchain KOMOE.</p>
              <div className="mt-8 border border-slate-200 p-4 rounded bg-slate-50 text-xs font-mono w-full max-w-lg text-center break-all">
                Hash: 0x8f2a9c...41c6
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
