"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface NavBarProps { path: string; }

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar({ path }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") close(); }, []);
  useEffect(() => { if (open) { document.addEventListener("keydown", handleKey); document.body.style.overflow = "hidden"; } else { document.body.style.overflow = ""; document.removeEventListener("keydown", handleKey); } return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", handleKey); }; }, [open, handleKey]);

  return (
    <nav className="mx-4 mt-3 mb-2 rounded-2xl border border-[#1e1e21]/80 bg-[#0b0b0c]/80 backdrop-blur-lg shadow-lg shadow-black/20 sticky top-2 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={close}>
          <div className="relative rounded-lg p-1.5 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all">
            <Image src="/logo.svg" alt="BlueBoard Logo" width={32} height={28} className="drop-shadow-sm group-hover:scale-105 transition-transform" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">BlueBoard</span>
        </Link>
        <div className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex items-center gap-3 relative">
            {links.map(l => { const active = l.href === "/" ? path === l.href : path.startsWith(l.href); return (
              <li key={l.href} className="group/nav relative">
                <Link href={l.href} onClick={close} className={`inline-flex items-center justify-center relative px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded-md overflow-hidden ${active ? "text-white" : "text-gray-400"}`}>
                  <span className={`absolute inset-0 -z-10 opacity-0 translate-y-3 scale-95 blur-sm transition-all duration-500 group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:scale-100 ${active ? "opacity-100 translate-y-0 scale-100 blur-0" : ""} bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 rounded-md`} />
                  <span className="absolute inset-0 -z-10 rounded-md bg-white/0 group-hover/nav:bg-white/[0.03] transition-colors" />
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover/nav:w-8 transition-all duration-500 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full ${active ? "w-10" : ""}`} />
                  <span className="relative z-10 group-hover/nav:-translate-y-0.5 transition-transform duration-300">{l.label}</span>
                  <span className="pointer-events-none absolute inset-px rounded-[6px] opacity-0 group-hover/nav:opacity-100 transition duration-500 [background:radial-gradient(circle_at_30%_20%,rgba(96,165,250,.15),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,.15),transparent_55%)]" />
                  {active && <span className="absolute inset-0 rounded-md ring-1 ring-white/10" />}
                </Link>
              </li> );})}
          </ul>
        </div>
        <div className="hidden md:flex items-center justify-end gap-3">
          <Link href="/profile" onClick={close} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_0_rgba(168,85,247,0.4)] transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            Profile
          </Link>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={toggle} className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
            {open ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </div>
      </div>
      <div className={`md:hidden fixed inset-0 z-40 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={close} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute top-0 right-0 h-full w-72 max-w-full bg-[#0d0d10] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-400 ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
            <span className="font-semibold text-sm text-gray-300 tracking-wide">Menu</span>
            <button onClick={close} aria-label="Close menu" className="p-2 rounded-md hover:bg-white/5 text-gray-400 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="flex flex-col gap-1 px-4">
              {links.map(l => { const active = l.href === "/" ? path === l.href : path.startsWith(l.href); return (
                <li key={l.href}>
                  <Link href={l.href} onClick={close} className={`block w-full rounded-lg px-4 py-3 text-sm font-medium transition relative overflow-hidden ${active ? "text-white" : "text-gray-300 hover:text-white"}`}>
                    <span className={`absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 ${active ? "from-blue-600/20 via-purple-600/20 to-pink-600/20" : "group-hover:from-blue-600/10"} rounded-lg`} />
                    {l.label}
                    {active && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-pink-400 shadow" />}
                  </Link>
                </li> );})}
            </ul>
          </nav>
          <div className="p-4 border-t border-white/5">
            <Link href="/profile" onClick={close} className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:shadow-lg transition">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
