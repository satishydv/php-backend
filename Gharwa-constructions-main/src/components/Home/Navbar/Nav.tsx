"use client";
import Logo from '@/components/Helper/Logo'
import { navLinks } from '@/constant/constant'
import Link from 'next/link'
import React from 'react'
import { HiBars3BottomRight } from 'react-icons/hi2'

type Props = {
  openNav: () => void;
}

const Nav = ({openNav}:Props) => {
  return (
    <div className={`bg-white dark:bg-gray-900 shadow-md h-[12vh] z-[100] fixed w-full transition-all duration-200`}>
      <div className='flex items-center justify-between h-full w-[90%] xl:w-[80%] mx-auto'>
        <Logo/>
        {/* NAVLINKS */}
        <div className='hidden md:flex items-center space-x-6'>
        {
          navLinks.map((link) => {
            return (
              <Link
              href={link.url}
              key={link.id}
              className='text-gray-800 hover:text-orange-500 dark:text-white font-bold md:text-[18px] transition-all duration-200'
              >
              {link.label}
              </Link>
            )
          })
        }
        </div>
        {/* Button */}
        <div className='flex items-center space-x-4'>
          <Link 
            href="/login"
            className='bg-yellow-500 px-8 py-2.5 text-white font-bold rounded-lg hover:bg-black transition-all duration-300 cursor-pointer'
          >
            Login
          </Link>
          
          {/* Burger Menu */}
          <HiBars3BottomRight
          onClick={openNav}
          className='w-8 h-8 cursor-pointer text-yellow-500 md:hidden'
          />
        </div>
      </div>
    </div>
  )
}

export default Nav