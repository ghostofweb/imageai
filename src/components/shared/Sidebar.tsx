'use client';

import { useEffect, useState } from 'react';
import { navLinks } from '@/constants';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button2';

const Sidebar = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <aside className="hidden sm:flex w-64 min-h-screen bg-gray-100 p-6 shadow-xl flex-col fixed top-0 left-0">
      {/* Logo Section */}
      <Link href="/" className="flex justify-center mb-6">
        <Image src="/favicon.png" alt="Logo" width={180} height={24} priority />
      </Link>

      {isClient && (
        <>
          {/* Main Navigation */}
          <nav className="flex flex-col flex-grow">
            <ul className="space-y-2">
              {navLinks.slice(0, 6).map(({ route, icon, label }) => {
                const isActive = pathname === route;

                return (
                  <li key={route} className="rounded-lg">
                    <Link
                      href={route}
                      className={`flex items-center gap-3 p-3 w-full h-full rounded-lg transition-all cursor-pointer 
                      ${isActive ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
                    >
                      <Image
                        src={icon}
                        alt={`${label} Icon`}
                        width={24}
                        height={24}
                        className={`${isActive ? 'brightness-200' : 'brightness-100'}`}
                      />
                      <span className="text-base font-medium">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile & Sign-Out/Login (Pushed to Bottom) */}
          <div className="mt-auto">
            <SignedIn>
              <ul className="space-y-2">
                {navLinks.slice(6).map(({ route, icon, label }) => {
                  const isActive = pathname === route;

                  return (
                    <li key={route} className="rounded-lg">
                      <Link
                        href={route}
                        className={`flex items-center gap-3 p-3 w-full h-full rounded-lg transition-all cursor-pointer 
                        ${isActive ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
                      >
                        <Image
                          src={icon}
                          alt={`${label} Icon`}
                          width={24}
                          height={24}
                          className={`${isActive ? 'brightness-200' : 'brightness-100'}`}
                        />
                        <span className="text-base font-medium">{label}</span>
                      </Link>
                    </li>
                  );
                })}
                <li className="flex items-center justify-between gap-2 p-4 bg-gray-200 rounded-lg">
                  <UserButton showName />
                </li>
              </ul>
            </SignedIn>

            <SignedOut>
              <Button asChild className="w-full mt-2 button bg-purple-gradient bg-cover">
                <Link href={'/sign-in'}>Login</Link>
              </Button>
            </SignedOut>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
