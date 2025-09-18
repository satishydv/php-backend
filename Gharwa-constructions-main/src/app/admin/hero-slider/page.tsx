'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EditHeroModal from '@/components/Admin/EditHeroModal';

interface HeroImage {
  id: number;
  name: string;
  filename: string;
  url: string;
  alt: string;
  order: number;
}

export default function AdminHeroSliderPage() {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal state
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch hero images from API
  const fetchHeroImages = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/hero-images`);
      if (response.ok) {
        const data = await response.json();
        // Filter out images with empty URLs and add fallback URLs
        const processedData = data.map((image: { url?: string; filename: string; alt?: string; name?: string }) => ({
          ...image,
          url: image.url || `/Hero/${image.filename}`,
          alt: image.alt || image.name || 'Hero image'
        })).filter((image: { filename: string }) => image.filename); // Only include images with filenames
        
        setHeroImages(processedData);
        
        // Clear browser cache for hero images to show updated versions
        const timestamp = Date.now();
        const processedDataWithCacheBust = processedData.map((image: { url: string; filename: string }) => ({
          ...image,
          url: image.url + '?v=' + timestamp
        }));
        
        setHeroImages(processedDataWithCacheBust);
      } else {
        console.error('Failed to fetch hero images');
        // Fallback to static data if API fails
        setHeroImages([
          {
            id: 1,
            name: "Hero Image 1",
            filename: "Hero.jpg",
            url: "/Hero/Hero.jpg",
            alt: "Main hero image",
            order: 1
          },
          {
            id: 2,
            name: "Hero Image 2",
            filename: "hero2.webp",
            url: "/Hero/hero2.webp",
            alt: "Secondary hero image",
            order: 2
          },
          {
            id: 3,
            name: "Hero Image 3",
            filename: "hero3.webp",
            url: "/Hero/hero3.webp",
            alt: "Tertiary hero image",
            order: 3
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching hero images:', error);
      // Use fallback data on error
      setHeroImages([
        {
          id: 1,
          name: "Hero Image 1",
          filename: "Hero.jpg",
          url: "/Hero/Hero.jpg",
          alt: "Main hero image",
          order: 1
        },
        {
          id: 2,
          name: "Hero Image 2",
          filename: "hero2.webp",
          url: "/Hero/hero2.webp",
          alt: "Secondary hero image",
          order: 2
        },
        {
          id: 3,
          name: "Hero Image 3",
          filename: "hero3.webp",
          url: "/Hero/hero3.webp",
          alt: "Tertiary hero image",
          order: 3
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load images on component mount
  useEffect(() => {
    fetchHeroImages();
  }, []);

  // Refresh images when returning from upload page (using sessionStorage flag)
  useEffect(() => {
    const checkForRefresh = () => {
      const shouldRefresh = sessionStorage.getItem('hero-refresh-needed');
      if (shouldRefresh === 'true') {
        sessionStorage.removeItem('hero-refresh-needed');
        fetchHeroImages();
      }
    };

    // Check on mount
    checkForRefresh();

    // Check when page becomes visible (but only if flag is set)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedImages(heroImages.map(img => img.id));
    } else {
      setSelectedImages([]);
    }
  };

  const handleSelectImage = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedImages(prev => [...prev, id]);
    } else {
      setSelectedImages(prev => prev.filter(imgId => imgId !== id));
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedImages.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedImages.length} selected hero images?`)) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Authentication required. Please log in again.');
          return;
        }

        // Delete each selected image
        const deletePromises = selectedImages.map(async (id) => {
          const response = await fetch(`/api/admin/hero-slider?id=${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete hero image');
          }

          return id;
        });

        await Promise.all(deletePromises);
        
        // Update local state only after successful deletion
        setHeroImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
        setSelectedImages([]);
        
        alert(`${selectedImages.length} hero images deleted successfully!`);
      } catch (error) {
        console.error('Error deleting hero images:', error);
        alert(`Error deleting hero images: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (confirm('Are you sure you want to delete this hero image?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Authentication required. Please log in again.');
          return;
        }

        const response = await fetch(`/api/admin/hero-slider?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Update local state only after successful deletion
          setHeroImages(prev => prev.filter(img => img.id !== id));
          alert('Hero image deleted successfully!');
        } else {
          const errorData = await response.json();
          alert(`Error deleting hero image: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting hero image:', error);
        alert(`Error deleting hero image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleEditImage = (id: number) => {
    const image = heroImages.find(img => img.id === id);
    if (image) {
      setEditingImage(image);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = (updatedImage: HeroImage) => {
    setHeroImages(prev => 
      prev.map(img => 
        img.id === updatedImage.id ? updatedImage : img
      )
    );
    setIsEditModalOpen(false);
    setEditingImage(null);
    // Refresh the images list to ensure we have the latest data
    fetchHeroImages();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingImage(null);
  };

  const handleReorder = (id: number, direction: 'up' | 'down') => {
    setHeroImages(prev => {
      const currentIndex = prev.findIndex(img => img.id === id);
      if (currentIndex === -1) return prev;

      const newImages = [...prev];
      if (direction === 'up' && currentIndex > 0) {
        // Move up
        [newImages[currentIndex], newImages[currentIndex - 1]] = 
        [newImages[currentIndex - 1], newImages[currentIndex]];
        // Update order
        newImages[currentIndex].order = currentIndex + 1;
        newImages[currentIndex - 1].order = currentIndex;
      } else if (direction === 'down' && currentIndex < newImages.length - 1) {
        // Move down
        [newImages[currentIndex], newImages[currentIndex + 1]] = 
        [newImages[currentIndex + 1], newImages[currentIndex]];
        // Update order
        newImages[currentIndex].order = currentIndex + 1;
        newImages[currentIndex + 1].order = currentIndex + 2;
      }
      return newImages;
    });
  };

  return (
    <div>
      {/* Fixed Header - positioned to not overlap with sidebar - Hidden on mobile */}
      <div className="hidden lg:block bg-gray-50 fixed top-0 left-64 right-0 z-[200] p-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Slider Images</h1>
        <p className="text-gray-600">Manage your hero section slider images</p>
      </div>

      {/* Mobile Header - visible only on mobile */}
      <div className="lg:hidden p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Slider Images</h1>
        <p className="text-gray-600">Manage your hero section slider images</p>
      </div>

      {/* Main Content with responsive top padding */}
      <div className="pt-6 lg:pt-32 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Action Buttons Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-end">
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchHeroImages}
                disabled={isLoading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDeleteMultiple}
                disabled={selectedImages.length === 0}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Delete Multiple Data
              </button>
              <Link
                href="/admin/hero-slider/upload"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                ADD
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Images Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading hero images...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedImages.length === heroImages.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heroImages.map((image) => (
                  <tr key={image.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={(e) => handleSelectImage(image.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{image.order}</span>
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => handleReorder(image.id, 'up')}
                            disabled={image.order === 1}
                            className="w-6 h-6 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded flex items-center justify-center text-xs"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleReorder(image.id, 'down')}
                            disabled={image.order === heroImages.length}
                            className="w-6 h-6 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded flex items-center justify-center text-xs"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {image.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-20 h-16 relative rounded-lg overflow-hidden border border-gray-200">
                        {image.url && image.url.trim() !== '' ? (
                          <Image
                            src={image.url}
                            alt={image.alt || image.name || 'Hero image'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditImage(image.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Total Hero Images: {heroImages.length} | Selected: {selectedImages.length}
        </div>

          
        </div>
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <EditHeroModal
          image={editingImage}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
