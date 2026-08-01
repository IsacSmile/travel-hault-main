'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  LayoutDashboard,
  Package,
  MapPin,
  Tag,
  Home,
  Image as ImageIcon,
  Inbox,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/manage', icon: LayoutDashboard },
  { name: 'Packages & Variants', href: '/manage/packages', icon: Package },
  { name: 'Destinations', href: '/manage/destinations', icon: MapPin },
  { name: 'Trip Themes', href: '/manage/trip-themes', icon: Tag },
  { name: 'Homepage Content', href: '/manage/homepage', icon: Home },
  { name: 'Gallery Manager', href: '/manage/gallery', icon: ImageIcon },
  { name: 'Enquiries Inbox', href: '/manage/enquiries', icon: Inbox },
  { name: 'Subscribers', href: '/manage/subscribers', icon: Mail },
  { name: 'Site Settings', href: '/manage/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/manage/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-white text-[#051b2e] flex flex-col min-h-screen border-r border-gray-200 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <Link href="/manage" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#051b2e] text-[#c9a15a] flex items-center justify-center font-bold shadow">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-[#051b2e] block leading-tight">
              Travel & Hault
            </span>
            <span className="text-[10px] uppercase text-[#b8934b] font-bold tracking-widest block">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/manage' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? 'bg-[#051b2e] text-[#c9a15a] shadow-md'
                  : 'text-gray-700 hover:bg-[#F5F0E6] hover:text-[#051b2e]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#c9a15a]' : 'text-gray-500'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Options */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-[#F5F0E6] transition"
        >
          <ExternalLink className="w-4 h-4 text-[#b8934b]" />
          <span>View Public Site</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
