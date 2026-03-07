'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, ImageIcon, X, File as FileIcon } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  description?: string;
  previewUrl?: string | null;
  loading?: boolean;
  className?: string;
}

export default function Dropzone({
  onFileSelect,
  accept = 'image/*',
  label = 'Drop an image or click to upload',
  description = 'PNG, JPG, WebP, GIF supported',
  previewUrl,
  loading,
  className = '',
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer border-2 border-dashed rounded-[2rem] p-12 
        transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden
        ${isDragging 
          ? 'border-white bg-white/[0.05] scale-[1.02]' 
          : 'border-white/[0.08] bg-white/[0.01] hover:border-white/[0.2] hover:bg-white/[0.03]'
        }
        ${loading ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative w-full flex flex-col items-center animate-in zoom-in-95 duration-500">
          <div className="relative group/preview shadow-2xl rounded-2xl overflow-hidden border border-white/10">
            <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 object-contain transition-transform duration-700 group-hover/preview:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Click to Change</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-[1.25rem] bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:bg-white/[0.06] group-hover:border-white/[0.2]">
            <Upload size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white tracking-tight">{label}</h3>
            <p className="text-[11px] text-zinc-600 font-medium uppercase tracking-widest">{description}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-[2rem] z-20">
          <div className="flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Processing Engine...</p>
          </div>
        </div>
      )}
    </div>
  );
}
