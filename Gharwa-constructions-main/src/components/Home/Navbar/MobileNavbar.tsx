import { navLinks } from '@/constant/constant'
import Link from 'next/link'
import React from 'react'
import { CgClose } from 'react-icons/cg'

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNavbar = ({closeNav, showNav}: Props) => {
  const navOpen = showNav ? "translate-x-0" : "translate-x-[-100%]"
  return (
    <div>
      {/* overlay */}
      <div className={`fixed inset-0 ${navOpen} transform transition-all duration-500 z-[1002] bg-black opacity-70 w-full h-screen`}>

      </div>
      {/* Navlinks */}
      <div
    className={`text-white ${navOpen} fixed justify-center flex flex-col h-full transform transition-all duration-500 delay-300 w-[80%] sm:w-[60%] bg-yellow-500 space-y-6 z-[1050]`}
    >
      {navLinks.map((link) => {
            return (
              <Link
              href={link.url}
              key={link.id}
              onClick={closeNav}
              >
                <p className='text-white w-fit text-[20px] ml-12 pb-1 border-b-[1.5px] border-white sm:text-[30px]'>
                {link.label}
                </p>
              </Link>
            )})
          }
          {/* close icon */}
          <CgClose
          onClick={closeNav}
          className='absolute top-[0.7rem] right-[1.4rem] sm:w-8 sm:h-8 w-6 h-6'/>
    </div>
    </div>
    
  );
};

export default MobileNavbar