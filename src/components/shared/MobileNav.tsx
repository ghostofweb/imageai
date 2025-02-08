import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Link from 'next/link'
import Image from 'next/image'
  
const MobileNav = () => {
  return (
    <div>
        <header className='header'>
            <Link href={'/'} className='flex items-center gap-2 md:py-2'>
            <Image
            src="/favicon.png"
            alt="logo"
            width={100}
            height={28}
            />
            </Link>
        </header>
    </div>
  )
}

export default MobileNav