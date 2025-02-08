'use client'

import { navLinks } from '@/constants'
import { SignedIn } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import React from 'react'

const Sidebar = () => {
    const pathname = usePathname(); // ✅ Get current path

    return (
        <motion.aside
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="sidebar w-64 min-h-screen bg-gray-100 dark:bg-gray-900 p-6 shadow-lg"
        >
            <motion.div className="flex flex-col gap-6">
                {/* Logo */}
                <Link href="/" className="flex justify-center">
                    <Image src="/favicon.png" alt="logo" width={100} height={24} />
                </Link>

                {/* Navigation Links */}
                <nav className="sidebar-nav mt-4">
                    <SignedIn>
                        <ul className="sidebar-nav_elements flex flex-col gap-3">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.route;
                                return (
                                    <motion.li
                                        key={link.route}
                                        whileHover={{ scale: 1.05, x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="group"
                                    >
                                        <Link
                                            href={link.route}
                                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                                            }`}
                                            aria-current={isActive ? "page" : undefined}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </SignedIn>
                </nav>
            </motion.div>
        </motion.aside>
    );
};

export default Sidebar;
