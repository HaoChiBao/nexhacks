"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download, Copy, Share2, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProfileQrCardProps {
    userId: string;
}

export function ProfileQrCard({ userId }: ProfileQrCardProps) {
    const [copied, setCopied] = useState(false);
    
    // In production this would be window.location.origin, but here we construct it.
    // We'll use a placeholder origin if SSR, or window if client.
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://prismlines.com';
    const shareUrl = `${origin}/user/${userId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const svg = document.getElementById("profile-qr-code");
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL("image/png");
                
                const downloadLink = document.createElement("a");
                downloadLink.download = `prismlines-profile-${userId}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            };
            img.src = "data:image/svg+xml;base64," + btoa(svgData);
        }
    };

    return (
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 flex flex-col items-center gap-6 shadow-xl relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="text-center">
                 <h3 className="text-lg font-bold text-white mb-1">Share Profile</h3>
                 <p className="text-xs text-gray-500">Scan to view portfolio details</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-lg shadow-emerald-900/10">
                <QRCodeSVG 
                    id="profile-qr-code"
                    value={shareUrl}
                    size={160}
                    level="M"
                    includeMargin={false}
                    fgColor="#000000"
                    bgColor="#ffffff"
                    imageSettings={{
                        src: "https://api.dicebear.com/7.x/shapes/svg?seed=Prism", // Placeholder logo
                        x: undefined,
                        y: undefined,
                        height: 24,
                        width: 24,
                        excavate: true,
                    }}
                />
            </div>

            <div className="w-full space-y-3">
                <div className="flex items-center gap-2 bg-[#0A0A0A] border border-gray-800 rounded-lg p-2.5">
                    <div className="flex-1 truncate text-xs font-mono text-gray-400 select-all">
                        {shareUrl}
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
                        title="Copy Link"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
                
                <button 
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold transition-colors"
                >
                    <Download className="w-3.5 h-3.5" /> Download QR
                </button>
            </div>
        </div>
    );
}
