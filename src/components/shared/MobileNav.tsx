'use client'
import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import { navLinks } from '@/constants';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react'; // Import black close icon
import { Button } from '../ui/button';

const MobileNav = () => {
    const pathname = usePathname();

    return (
        <header className="header flex items-center justify-between px-5 py-3 bg-white shadow-md">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
                <Image src="/favicon.png" alt="logo" width={120} height={45} />
            </Link>

            {/* User & Menu Button */}
            <nav className="flex items-center gap-4">
                <SignedIn>
                    <UserButton />
                    {/* Mobile Sidebar Menu */}
                    <Sheet>
                        <SheetTrigger className="text-gray-600">
                            <Image src="/assets/icons/menu.svg" alt="menu" width={32} height={32} />
                        </SheetTrigger>

                        <SheetContent className="sm:w-64 flex flex-col p-5">
                            {/* Header: Logo + Close Button */}
                            <div className="flex items-center justify-between">
                                <Image src="/favicon.png" alt="logo" width={120} height={42} />
                                <SheetClose asChild>
                                    <button className="text-black hover:text-gray-700">
                                        <X className="w-6 h-6" />
                                    </button>
                                </SheetClose>
                            </div>

                            {/* Navigation Links */}
                            <ul className="space-y-2 py-4">
                                {navLinks.map(({ route, icon, label }) => {
                                    const isActive = pathname === route;

                                    return (
                                        <motion.li
                                            key={route}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer 
                                            ${isActive ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            <Link href={route} className="flex items-center gap-3 w-full">
                                                <Image
                                                    src={icon}
                                                    alt={`${label} Icon`}
                                                    width={24}
                                                    height={24}
                                                    className={`${isActive ? 'brightness-200' : 'brightness-100'}`}
                                                />
                                                <span className="text-base font-medium">{label}</span>
                                            </Link>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </SheetContent>
                    </Sheet>
                </SignedIn>

                {/* Show login button if signed out */}
                <SignedOut>
                    <SignInButton>
                        <Button variant="outline" className="px-4 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                            Login
                        </Button>
                    </SignInButton>
                </SignedOut>
            </nav>
        </header>
    );
};

export default MobileNav;
