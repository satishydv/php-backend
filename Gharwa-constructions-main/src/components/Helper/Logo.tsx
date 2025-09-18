"use client";
import React from 'react'
import Image from 'next/image';

const Logo = () => {
  return (
    <div className='flex items-center space-x-2'>
        <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden'>
            <Image 
              src="/icon.png" 
              alt="Gharwa Development Logo" 
              width={28} 
              height={28}
              className="w-12 h-12  rounded-full"
            />
        </div>
        <h1 className='text-xl sm:text-xl md:text-2xl font-semibold text-red-500'>
            Gharwa Development
        </h1>
    </div>
  )
}

export default Logo