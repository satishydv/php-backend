import React from 'react'
import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter, FaYoutube } from 'react-icons/fa'
import Image from 'next/image'

const Footer = () => {
  return (
    <div className='pt-16 pb-16 bg-yellow-500 dark:bg-gray-900'>
        <div className='w-[90%] md:w-[80%] mx-auto items-start grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10'>
            {/* 1st */}
            <div>
                <div className='flex items-center space-x-2'>
                    <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center flex-col'>
                        <Image 
                          src="/icon.png" 
                          alt="Gharwa Development Logo" 
                          width={24} 
                          height={24}
                          className="h-6 w-6"
                        />
                    </div>
                    <h1 className='text-xl hidden sm:block md:text-2xl text-white font-bold'>Gharwa Development</h1>
                   
                </div>
                 <p className='mt-4 text-gray-200 font-medium'>
            Gharwa Development is a leading construction company committed to delivering comprehensive building solutions and services. We specialize in transforming.
        </p>
        <div className='mt-4 space-x-4 flex items-center'>
            <div className='flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full bg-blue text-white cursor-pointer hover:bg-gray-600'>
                      <FaFacebook className='h-4 w-4'/>
            </div>
             <div className='flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full bg-blue text-white cursor-pointer hover:bg-gray-600'>
                      <FaInstagram className='h-4 w-4'/>
            </div>
             <div className='flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full bg-blue text-white cursor-pointer hover:bg-gray-600'>
                      <FaWhatsapp className='h-4 w-4'/>
            </div>
            <div className='flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full bg-blue text-white cursor-pointer hover:bg-gray-600'>
                      <FaYoutube className='h-4 w-4'/>
            </div>

        </div>
            </div>
            {/* 2nd part */}
            <div className='space-y-5'>
                <h1 className='text-lg font-bold text-white'>Company</h1>
                <p className='footer_link'>About us</p>
                <p className='footer_link'>News and Press</p>
                <p className='footer_link'>Our Customers</p>
                <p className='footer_link'>Leadership</p>
                <p className='footer_link'>Carress</p>

            </div>
            {/* 3rd part */}
            <div className='space-y-5'>
                <h1 className='text-lg font-bold text-white'>Resource</h1>
                <p className='footer_link'>About us</p>
                <p className='footer_link'>News and Press</p>
                <p className='footer_link'>Our Customers</p>
                <p className='footer_link'>Leadership</p>
                <p className='footer_link'>Carress</p>

            </div>
            {/*4th part  */}
            <div className='space-y-5'>
                <h1 className='text-lg font-bold text-white'>Contact us</h1>
                <div className='mt-6'>
                   <h1 className='text-lg font-bold text-white'>Our Mobile Number</h1>
                     <p className='text-black dark:text-white font-medium'>+91 9939129921</p>
                </div>
                <div className='mt-6'>
                   <h1 className='text-lg font-bold text-white'>Our Email</h1>
                     <p className='text-black dark:text-white font-medium'>gharwadevelopment@gmail.com
                        </p>
                        </div>

        </div>
        </div>
        {/* Bottom part */}
        <div className='mt-8 w-[80%] md:w-[70%] mx-auto border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm'>
            <p className='text-center text-white md:text-left'>Copyright © 2025 Gharwa Development. All rights reserved</p>
            <div className='flex items-center text-white space-x-4 mt-4 md:mt-0'>
                <span>Social :</span>
                <span className='text-white hover:text-gray-500'><FaFacebook/></span>
                <span className='text-white hover:text-gray-500'><FaTwitter/></span>
                <span className='text-white hover:text-gray-500'><FaInstagram/></span>
                <span className='text-white hover:text-gray-500'><FaYoutube/></span>
            </div>
        </div>
    </div>
    
  )
}

export default Footer