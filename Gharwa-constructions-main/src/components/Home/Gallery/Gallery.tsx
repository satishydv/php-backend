import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import GalleryModal from './GalleryModal'

interface GalleryImage {
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

const Gallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch('/api/gallery-images/')
        if (response.ok) {
          const data = await response.json()
          setGalleryImages(data)
        } else {
          console.error('Failed to fetch gallery images')
          // Fallback to hardcoded images if API fails - using actual images from public/Gallery folder
          setGalleryImages([
            { id: 1, filename: 'gallery-1.jpg', name: 'Gallery 1', alt_text: 'Gallery image 1', description: '', display_order: 1, is_active: true, created_at: '', updated_at: '' },
            { id: 2, filename: 'gallery-2.jpg', name: 'Gallery 2', alt_text: 'Gallery image 2', description: '', display_order: 2, is_active: true, created_at: '', updated_at: '' },
            { id: 3, filename: 'gallery-3.jpg', name: 'Gallery 3', alt_text: 'Gallery image 3', description: '', display_order: 3, is_active: true, created_at: '', updated_at: '' },
            { id: 4, filename: 'gallery-5.webp', name: 'Gallery 4', alt_text: 'Gallery image 4', description: '', display_order: 4, is_active: true, created_at: '', updated_at: '' },
            { id: 5, filename: 'gallery-6.webp', name: 'Gallery 5', alt_text: 'Gallery image 5', description: '', display_order: 5, is_active: true, created_at: '', updated_at: '' },
            { id: 6, filename: 'gallery-7.webp', name: 'Gallery 6', alt_text: 'Gallery image 6', description: '', display_order: 6, is_active: true, created_at: '', updated_at: '' },
            { id: 7, filename: 'p-1.jpg', name: 'Gallery 7', alt_text: 'Gallery image 7', description: '', display_order: 7, is_active: true, created_at: '', updated_at: '' }
          ])
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error)
        // Fallback to hardcoded images if API fails - using actual images from public/Gallery folder
        setGalleryImages([
          { id: 1, filename: 'gallery-1.jpg', name: 'Gallery 1', alt_text: 'Gallery image 1', description: '', display_order: 1, is_active: true, created_at: '', updated_at: '' },
          { id: 2, filename: 'gallery-2.jpg', name: 'Gallery 2', alt_text: 'Gallery image 2', description: '', display_order: 2, is_active: true, created_at: '', updated_at: '' },
          { id: 3, filename: 'gallery-3.jpg', name: 'Gallery 3', alt_text: 'Gallery image 3', description: '', display_order: 3, is_active: true, created_at: '', updated_at: '' },
          { id: 4, filename: 'gallery-5.webp', name: 'Gallery 4', alt_text: 'Gallery image 4', description: '', display_order: 4, is_active: true, created_at: '', updated_at: '' },
          { id: 5, filename: 'gallery-6.webp', name: 'Gallery 5', alt_text: 'Gallery image 5', description: '', display_order: 5, is_active: true, created_at: '', updated_at: '' },
          { id: 6, filename: 'gallery-7.webp', name: 'Gallery 6', alt_text: 'Gallery image 6', description: '', display_order: 6, is_active: true, created_at: '', updated_at: '' },
          { id: 7, filename: 'p-1.jpg', name: 'Gallery 7', alt_text: 'Gallery image 7', description: '', display_order: 7, is_active: true, created_at: '', updated_at: '' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Our{' '}
              <span className="text-yellow-500">Gallery</span>
            </h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Our{' '}
            <span className="text-yellow-500">Gallery</span>
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id} 
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <div className="aspect-square relative">
                <Image
                  src={`/Gallery/${image.filename}`}
                  alt={image.alt_text}
                  fill
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      <GalleryModal
        images={galleryImages.map(img => `/Gallery/${img.filename}`)}
        currentImageIndex={selectedImageIndex}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  )
}

export default Gallery