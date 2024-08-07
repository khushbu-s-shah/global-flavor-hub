//import { Linden_Hill } from 'next/font/google'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <header className='bg-gradient-to-n from-green-400 via-blue-500 to-purple-600 shadow-md py-4'>
        <div className="container mx-auto flex justify-between items-center px-4">
            <Link href='/' className='text-3xl font-bold text-white'>Global Flavor Hub</Link>
        </div>  
    </header>
  );
}