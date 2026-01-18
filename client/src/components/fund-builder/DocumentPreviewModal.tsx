import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, Download, FileText, FileJson, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    type: "markdown" | "json" | "pdf";
    filename: string;
}

export function DocumentPreviewModal({
    isOpen,
    onClose,
    title,
    content,
    type,
    filename,
}: DocumentPreviewModalProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        if (type === "pdf") return;
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        let blob;
        if (type === "pdf") {
            const byteCharacters = atob(content);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: "application/pdf" });
        } else {
            blob = new Blob([content], { type: "text/plain" });
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col bg-surface-dark border-border-dark p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-border-dark flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            {type === "markdown" ? <FileText className="w-5 h-5" /> : type === "json" ? <FileJson className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white">{title}</DialogTitle>
                            <DialogDescription className="text-gray-400 text-xs">
                                Generated AI Report • {new Date().toLocaleDateString()}
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {type !== "pdf" && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="border-gray-800 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-grow overflow-hidden p-0 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {type === "pdf" ? (
                        <iframe
                            src={`data:application/pdf;base64,${content}`}
                            className="w-full h-full border-0"
                            title="PDF Preview"
                        />
                    ) : (
                        <div className="p-8 h-full overflow-y-auto">
                            <div className={cn(
                                "prose prose-invert max-w-none prose-emerald",
                                "prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300",
                                "prose-strong:text-emerald-400 prose-code:text-emerald-300",
                                "prose-a:text-emerald-400 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-900/10 prose-blockquote:py-1",
                                type === "json" && "font-mono text-sm bg-gray-950 p-6 rounded-xl border border-border-dark whitespace-pre"
                            )}>
                                {type === "markdown" ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                                ) : (
                                    <code>{content}</code>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border-dark bg-gray-950/50 flex justify-end">
                    <Button onClick={onClose} className="bg-white text-black hover:bg-gray-200">
                        Close Preview
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
