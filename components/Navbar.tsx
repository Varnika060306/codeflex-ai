"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Zap, LayoutDashboard, Mic } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/onboarding", label: "New Program", icon: Mic },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10"
      style={{ background: "rgba(2,4,8,0.9)", backdropFilter: "blur(10px)" }}>

      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
          <Zap size={15} className="text-[#00ff88]" />
        </div>
        <span className="text-sm font-bold tracking-widest text-[#00ff88]"
          style={{ fontFamily: "Orbitron, monospace" }}>
          CODEFLEX<span className="text-white/30">.AI</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wider transition-all border ${
                active
                  ? "text-[#00ff88] border-[#00ff88]/30 bg-[#00ff88]/5"
                  : "text-white/40 hover:text-white/70 border-transparent"
              }`}>
              <Icon size={14} />
              {label.toUpperCase()}
            </Link>
          );
        })}
      </div>

      {/* User avatar from Clerk */}
      <div className="flex items-center gap-3">
        <span className="hidden md:flex items-center gap-2 text-xs text-[#00ff88]/40"
          style={{ fontFamily: "Share Tech Mono, monospace" }}>
          <span className="status-dot" /> SYSTEM ONLINE
        </span>
        <UserButton appearance={{
          elements: { avatarBox: "w-8 h-8 border border-[#00ff88]/30" }
        }} />
      </div>
    </nav>
  );
}