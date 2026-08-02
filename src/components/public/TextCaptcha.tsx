'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

interface TextCaptchaProps {
  value: string;
  onChange: (value: string) => void;
  onCodeGenerated?: (code: string) => void;
  label?: string;
  error?: boolean;
}

export default function TextCaptcha({
  value,
  onChange,
  onCodeGenerated,
  label = 'Security Captcha Verification',
  error = false,
}: TextCaptchaProps) {
  const [code, setCode] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate random 5-character captcha code excluding ambiguous characters
  const generateRandomCode = useCallback(() => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Avoid 0, O, 1, I
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  // Draw captcha onto canvas
  const drawCaptcha = useCallback((textCode: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#f8fafc');
    bgGradient.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw background noise lines
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(
        Math.random() * 150
      )}, ${Math.floor(Math.random() * 150)}, 0.25)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Draw background noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 200)}, ${Math.floor(
        Math.random() * 200
      )}, ${Math.floor(Math.random() * 200)}, 0.4)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Colors palette for characters
    const colors = ['#051b2e', '#b8934b', '#0f172a', '#1e293b', '#92400e'];

    // Draw characters with rotation & scaling
    ctx.font = 'bold 22px "Comic Sans MS", "Trebuchet MS", sans-serif';
    ctx.textBaseline = 'middle';

    const charSpacing = width / (textCode.length + 1);

    for (let i = 0; i < textCode.length; i++) {
      const char = textCode[i];
      const x = (i + 1) * charSpacing;
      const y = height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() - 0.5) * 0.4; // Rotation angle

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.fillStyle = colors[i % colors.length];
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 3;
      ctx.fillText(char, -8, 0);

      ctx.restore();
    }

    // Strike-through line for distortion
    ctx.strokeStyle = 'rgba(184, 147, 75, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, height / 2 + (Math.random() * 8 - 4));
    ctx.bezierCurveTo(
      width / 3,
      Math.random() * height,
      (2 * width) / 3,
      Math.random() * height,
      width - 10,
      height / 2 + (Math.random() * 8 - 4)
    );
    ctx.stroke();
  }, []);

  const refreshCaptcha = useCallback(() => {
    const newCode = generateRandomCode();
    setCode(newCode);
    if (onCodeGenerated) {
      onCodeGenerated(newCode);
    }
    drawCaptcha(newCode);
  }, [generateRandomCode, onCodeGenerated, drawCaptcha]);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  return (
    <div className="space-y-1.5 font-sans">
      <label className="block text-xs font-extrabold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-[#b8934b]" /> {label} *
      </label>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Captcha Image Canvas Box */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-gray-200 shrink-0">
          <canvas
            ref={canvasRef}
            width={140}
            height={40}
            className="rounded-lg shadow-inner select-none"
            title="Visual Security Captcha Code"
          />
          <button
            type="button"
            onClick={refreshCaptcha}
            className="p-2 text-gray-500 hover:text-[#051b2e] hover:bg-white rounded-lg transition shadow-sm active:scale-95"
            title="Generate new Captcha image"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* User Captcha Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            required
            maxLength={6}
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase().trim())}
            placeholder="Type code above..."
            className={`w-full px-3.5 py-2.5 bg-white border ${
              error ? 'border-red-400 bg-red-50/20' : 'border-gray-200'
            } rounded-xl text-sm font-mono font-bold tracking-widest outline-none focus:border-[#b8934b] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.02)] transition min-h-[44px] uppercase`}
          />
        </div>
      </div>
    </div>
  );
}
