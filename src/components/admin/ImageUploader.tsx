'use client';

import React, { useState } from 'react';
import { Upload, X, Link as LinkIcon } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Image',
  placeholder = 'https://... or upload a file',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onChange(data.url);
    } catch {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setUseUrlInput(!useUrlInput)}
          className="text-xs text-[#c9a15a] font-medium hover:underline flex items-center gap-1"
        >
          {useUrlInput ? (
            <>
              <Upload className="w-3 h-3" /> Switch to File Upload
            </>
          ) : (
            <>
              <LinkIcon className="w-3 h-3" /> Paste Image URL
            </>
          )}
        </button>
      </div>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-40 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : useUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c9a15a] focus:border-transparent outline-none text-sm text-gray-900 bg-white"
          />
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#c9a15a] transition bg-gray-50/50 cursor-pointer relative"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a15a]"></div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#c9a15a]/10 text-[#c9a15a] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-[#c9a15a] font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP or GIF</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
