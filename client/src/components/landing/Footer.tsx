"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Youtube } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-background-dark py-12 border-t border-border-dark relative z-20">
             <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    {/* Bottom Left: Logo + Rights */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                             <div className="relative w-8 h-8">
                                <Image
                                    src="/f.png"
                                    alt="PrismLines Logo"
                                    fill
                                    className="object-contain"
                                />
                             </div>
                             <span className="font-bold text-xl text-white tracking-tight">PrismLines</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} PrismLines. All rights reserved.
                        </p>
                    </div>

                    {/* Links & Socials */}
                    <div className="flex flex-col md:items-end gap-6">
                         {/* Socials */}
                         <div className="flex gap-4">
                            <Link href="https://github.com/HaoChiBao/nexhacks" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="https://youtube.com" target="_blank" className="text-gray-400 hover:text-red-500 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </Link>
                         </div>

                         {/* Legal Links */}
                         <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                            <Link href="/" className="hover:text-primary transition-colors">Risk Disclosure</Link>
                            <Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link href="/" className="hover:text-primary transition-colors">Terms & Conditions</Link>
                         </div>
                    </div>
                </div>
             </div>
        </footer>
    )
}
