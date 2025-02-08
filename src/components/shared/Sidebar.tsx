'use client';

import { navLinks } from '@/constants';
import { SignedIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import React from 'react';

const Sidebar = () => {
    const pathname = usePathname(); // ✅ Get current path

    return (
        <motion.aside
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            className="w-64 min-h-screen bg-gray-100 p-6 shadow-xl flex flex-col"
        >
            {/* Logo Section */}
            <Link href="/" className="flex justify-center mb-6">
                <Image src="/favicon.png" alt="Logo" width={100} height={24} priority />
            </Link>

            {/* Navigation Links */}
            <SignedIn>
                <nav className="flex flex-col gap-4">
                    <ul className="space-y-2">
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
                </nav>
            </SignedIn>
        </motion.aside>
    );
};

export default Sidebar;
