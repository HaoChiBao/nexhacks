"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Switch } from "@/components/ui/switch";
import { Bell, Menu, Search } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

export function Navbar() {
  const pathname = usePathname();
  const { isLiveMode, toggleLiveMode, balance } = useAppStore();

  const navLinks = [
    { name: "Explore Funds", href: "/funds" },
    { name: "Portfolio", href: "#" },
    { name: "Predictions", href: "#" },
    { name: "Audit Logs", href: "/audit" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background-dark/80 backdrop-blur-lg border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/funds" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
              P
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              PrintMoney
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-white bg-surface-dark border border-border-dark"
                      : "text-gray-400 hover:text-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Area */}
          <div className="hidden md:flex items-center gap-4">
            {/* Paper/Live Toggle */}
            <div className="flex items-center gap-2 mr-2 relative group">
              <span className={cn("text-xs font-medium uppercase tracking-wider", !isLiveMode ? "text-white" : "text-gray-400")}>Paper</span>
              <div 
                className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200", isLiveMode ? "bg-emerald-500" : "bg-gray-700")}
                onClick={toggleLiveMode}
              >
                 <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm", isLiveMode ? "left-5" : "left-0.5")} />
              </div>
              <span className={cn("text-xs font-bold uppercase tracking-wider", isLiveMode ? "text-white" : "text-gray-400")}>Live</span>
              
              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-xs text-gray-300 rounded shadow-lg border border-gray-700 w-48 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Switch between real trading (Live) and risk-free simulation (Paper).
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-background-dark bg-red-500"></span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-border-dark">
              <div className="text-right hidden lg:block">
                <p className="text-xs text-gray-400">Available Balance</p>
                <p className="text-sm font-semibold text-white">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <img
                alt="User avatar"
                className="h-8 w-8 rounded-full border border-gray-700 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGLQypHX8cVI-p9t-O1XesSr9lDpf2LiJl0-D_9sqlasd79RLLVF5O5pm5zMrdgFhhily3-zM26PPlEqh3k4ZMvBwevYLQYvQv0VqGHADEMtWvuSgstsMX0C-R8s_mWCjdqaaMlSJFmCWQBv5wShizK4Dxe1nfmwI5AYTI9yPa_I6jSbGQ6o4WhKHi-3BoJ5g7sv5QWqC5Rn7QTg_S7qXW9OkjhNtAJgwE82ey5FiZs4NJSp8DQ8LtjkJ8i9UuhUelum5O-opUB3Qi"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="bg-surface-dark inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-surface-hover focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
