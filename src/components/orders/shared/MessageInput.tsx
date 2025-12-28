/**
 * Reusable chat message input component
 * Handles text input, file attachments, and sending
 */

'use client';

import { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { AttachIcon, SendIcon } from '@/components/icons/DashboardIcons';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileSelect?: (file: File) => void;
  selectedFile?: File | null;
  onRemoveFile?: () => void;
  disabled?: boolean;
  placeholder?: string;
  showFileUpload?: boolean;
  maxFileSize?: number; // in MB
}

export function MessageInput({
  value,
  onChange,
  onSend,
  onFileSelect,
  selectedFile,
  onRemoveFile,
  disabled = false,
  placeholder = 'Scrie un mesaj...',
  showFileUpload = true,
  maxFileSize = 5
}: MessageInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`Fișierul este prea mare. Maxim ${maxFileSize}MB`);
        return;
      }
      onFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0] && onFileSelect) {
      const file = e.dataTransfer.files[0];
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`Fișierul este prea mare. Maxim ${maxFileSize}MB`);
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`relative ${dragActive ? 'ring-2 ring-orange-500 rounded-lg' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* File Preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-slate-800/50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm text-gray-300 truncate">{selectedFile.name}</span>
            <span className="text-xs text-gray-500 shrink-0">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          {onRemoveFile && (
            <button
              type="button"
              onClick={onRemoveFile}
              className="ml-2 p-1 text-red-400 hover:text-red-300 shrink-0"
              title="Elimină fișier"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={2}
            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          {/* Attach Button */}
          {showFileUpload && onFileSelect && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="absolute right-3 bottom-3 p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Atașează fișier"
              >
                <AttachIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || (!value.trim() && !selectedFile)}
          className="shrink-0 p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Trimite mesaj"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Drag Overlay */}
      {dragActive && (
        <div className="absolute inset-0 bg-orange-500/10 border-2 border-dashed border-orange-500 rounded-lg flex items-center justify-center pointer-events-none">
          <p className="text-orange-400 font-medium">Trage fișierul aici</p>
        </div>
      )}
    </div>
  );
}
