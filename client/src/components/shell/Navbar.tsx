"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Switch } from "@/components/ui/switch";
import { Bell, Menu, Search, LogOut } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";

import { useState } from "react";


export function Navbar() {
  const pathname = usePathname();
  const { isLiveMode, toggleLiveMode, balance } = useAppStore();
  const { user, signOut } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks = [
    { name: "Explore Funds", href: "/funds" },
    { name: "Create Fund", href: "/create-fund" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Audit Logs", href: "/audit" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background-dark/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/funds" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <img src="/f.png" alt="FanFunds Logo" className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-emerald-500/20" />
            <span className="font-bold text-xl tracking-tight text-white">
              Prismlines
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


            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative focus:outline-none"
              >
                 <Bell className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                 <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-background-dark bg-red-500"></span>
              </button>
              
              {showNotifications && (
                 <div className="absolute top-full right-0 mt-2 w-64 bg-surface-dark border border-border-dark rounded-lg shadow-xl z-50 p-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Notifications</h3>
                    <div className="space-y-2">
                        <div className="p-2 bg-gray-800/50 rounded text-xs text-gray-300">
                            Welcome to Prismlines! Start exploring prediction funds.
                        </div>
                    </div>
                 </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-border-dark">
              {user ? (
                <>
                  <div className="text-right hidden lg:block">
                    <p className="text-xs text-gray-400">Available Balance</p>
                    <p className="text-sm font-semibold text-white">
                      {/* Fix Hydration Error: Only render balance on client */}
                      <span suppressHydrationWarning>${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </p>
                  </div>
                  <Link href={`/user/${user.id}`}>
                      {user.user_metadata?.avatar_url ? (
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="Profile" 
                          className="h-8 w-8 rounded-full border border-white/10 cursor-pointer object-cover hover:ring-2 hover:ring-emerald-500/50 transition-all"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 border border-white/10 cursor-pointer hover:ring-2 hover:ring-emerald-500/50 transition-all"></div>
                      )}
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign out">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="default" size="sm">
                    Login
                  </Button>
                </Link>
              )}
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
