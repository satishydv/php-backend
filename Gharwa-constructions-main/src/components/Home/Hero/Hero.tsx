"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface HeroImage {
  id: number;
  filename: string;
  name: string;
  alt_text: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Hero = () => {
  const [images, setImages] = useState<HeroImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero-images/')
        if (response.ok) {
          const data = await response.json()
          setImages(data)
        } else {
          console.error('Failed to fetch hero images')
          // Fallback to hardcoded images if API fails - using actual images from public/Hero folder
          setImages([
            { id: 1, filename: 'h.webp', name: 'Construction Site 1', alt_text: 'Construction Site 1', description: '', display_order: 1, is_active: true, created_at: '', updated_at: '' },
            { id: 2, filename: 'istockphoto-1280697755-612x612.jpg', name: 'Construction Site 2', alt_text: 'Construction site view 2', description: '', display_order: 2, is_active: true, created_at: '', updated_at: '' },
            { id: 3, filename: 'p-9.jpg', name: 'Construction Site 3', alt_text: 'Construction site view 3', description: '', display_order: 3, is_active: true, created_at: '', updated_at: '' }
          ])
        }
      } catch (error) {
        console.error('Error fetching hero images:', error)
        // Fallback to hardcoded images if API fails - using actual images from public/Hero folder
        setImages([
          { id: 1, filename: 'h.webp', name: 'Construction Site 1', alt_text: 'Construction Site 1', description: '', display_order: 1, is_active: true, created_at: '', updated_at: '' },
          { id: 2, filename: 'istockphoto-1280697755-612x612.jpg', name: 'Construction Site 2', alt_text: 'Construction site view 2', description: '', display_order: 2, is_active: true, created_at: '', updated_at: '' },
          { id: 3, filename: 'p-9.jpg', name: 'Construction Site 3', alt_text: 'Construction site view 3', description: '', display_order: 3, is_active: true, created_at: '', updated_at: '' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchHeroImages()
  }, [])

  useEffect(() => {
    if (images.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, 4500)
      return () => clearInterval(intervalId)
    }
  }, [images.length])

  if (loading) {
    return (
      <div className='relative w-full h-[85vh] md:h-[120vh] bg-gray-200 animate-pulse'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-gray-500'>Loading hero images...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='relative w-full h-[85vh] md:h-[120vh]'>
      <div className='absolute inset-0'>
        {images.map((image, idx) => (
          <Image
            key={image.id}
            src={`/Hero/${image.filename}`}
            alt={image.alt_text}
            fill
            priority={idx === 0}
            className={`object-cover object-center transition-opacity duration-700 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>

      <div className='absolute inset-0 bg-black/60' />

      <div className='relative z-10 flex h-full items-center'>
        <div className='w-full text-left pl-6 pr-6 md:pl-16 lg:pl-24 xl:pl-32'>
          <h1 className='text-white font-extrabold leading-tight tracking-tight text-4xl md:text-5xl lg:text-6xl'>
            Best Architecture And
            <br className='hidden md:block' />
            Construction Services
          </h1>

          {/* <p className='mt-6 max-w-3xl text-white/90 text-base md:text-lg'>
            Ensuring designs comply with local building codes, zoning laws, and safety
            standards. Producing detailed drawings and specifications for the construction of the
            building. For More Information Contact us at
          </p> */}

          <div className='mt-6 flex flex-wrap items-center gap-3 md:gap-4'>
            <a
              href='tel:9873824375'
              className='rounded-md bg-amber-600 px-6 py-3 text-white font-semibold shadow hover:bg-amber-700 transition-colors'
            >
              Call Us
            </a>

            <a
              href='tel:9873824375'
              className='rounded-md bg-white/10 px-4 py-2 text-white font-semibold backdrop-blur hover:bg-white/15'
            >
              9873824375
            </a>

            <a
              href='tel:8877096309'
              className='rounded-md bg-white/10 px-4 py-2 text-white font-semibold backdrop-blur hover:bg-white/15'
            >
              8877096309
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero