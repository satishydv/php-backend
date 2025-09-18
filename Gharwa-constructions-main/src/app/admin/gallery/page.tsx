'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EditImageModal from '@/components/Admin/EditImageModal';

interface GalleryImage {
  id: number;
  name: string;
  filename: string;
  url: string;
  alt: string;
}

export default function AdminGalleryPage() {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal state
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch gallery images from API
  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/gallery-images');
      if (response.ok) {
        const data = await response.json();
        // Filter out images with empty URLs and add fallback URLs
        const processedData = data.map((image: { url?: string; filename: string; alt?: string; name?: string }) => ({
          ...image,
          url: image.url || `/Gallery/${image.filename}`,
          alt: image.alt || image.name || 'Gallery image'
        })).filter((image: { filename: string }) => image.filename); // Only include images with filenames
        
        setGalleryImages(processedData);
        
        // Clear browser cache for gallery images to show updated versions
        const timestamp = Date.now();
        const processedDataWithCacheBust = processedData.map((image: { url: string; filename: string }) => ({
          ...image,
          url: image.url + '?v=' + timestamp
        }));
        
        setGalleryImages(processedDataWithCacheBust);
      } else {
        console.error('Failed to fetch gallery images');
        // Fallback to static data if API fails
        setGalleryImages([
          {
            id: 1,
            name: "Gallery Image 1",
            filename: "gallery-1.jpg",
            url: "/Gallery/gallery-1.jpg",
            alt: "Construction site view"
          },
          {
            id: 2,
            name: "Gallery Image 2",
            filename: "gallery-2.jpg",
            url: "/Gallery/gallery-2.jpg",
            alt: "Building exterior"
          },
          {
            id: 3,
            name: "Gallery Image 3",
            filename: "gallery-3.jpg",
            url: "/Gallery/gallery-3.jpg",
            alt: "Interior design"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      // Use fallback data on error
      setGalleryImages([
        {
          id: 1,
          name: "Gallery Image 1",
          filename: "gallery-1.jpg",
          url: "/Gallery/gallery-1.jpg",
          alt: "Construction site view"
        },
        {
          id: 2,
          name: "Gallery Image 2",
          filename: "gallery-2.jpg",
          url: "/Gallery/gallery-2.jpg",
          alt: "Building exterior"
        },
        {
          id: 3,
          name: "Gallery Image 3",
          filename: "gallery-3.jpg",
          url: "/Gallery/gallery-3.jpg",
          alt: "Interior design"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load images on component mount
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // Refresh images when returning from upload page (using sessionStorage flag)
  useEffect(() => {
    const checkForRefresh = () => {
      const shouldRefresh = sessionStorage.getItem('gallery-refresh-needed');
      if (shouldRefresh === 'true') {
        sessionStorage.removeItem('gallery-refresh-needed');
        fetchGalleryImages();
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
      setSelectedImages(galleryImages.map(img => img.id));
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
    
    if (confirm(`Are you sure you want to delete ${selectedImages.length} selected images?`)) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Authentication required. Please log in again.');
          return;
        }

        // Delete each selected image
        const deletePromises = selectedImages.map(async (id) => {
          const response = await fetch(`/api/admin/gallery?id=${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete image');
          }

          return id;
        });

        await Promise.all(deletePromises);
        
        // Update local state only after successful deletion
        setGalleryImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
        setSelectedImages([]);
        
        alert(`${selectedImages.length} images deleted successfully!`);
      } catch (error) {
        console.error('Error deleting images:', error);
        alert(`Error deleting images: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Authentication required. Please log in again.');
          return;
        }

        const response = await fetch(`/api/admin/gallery?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Update local state only after successful deletion
          setGalleryImages(prev => prev.filter(img => img.id !== id));
          alert('Image deleted successfully!');
        } else {
          const errorData = await response.json();
          alert(`Error deleting image: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        alert(`Error deleting image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleEditImage = (id: number) => {
    const image = galleryImages.find(img => img.id === id);
    if (image) {
      setEditingImage(image);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = (updatedImage: GalleryImage) => {
    setGalleryImages(prev => 
      prev.map(img => 
        img.id === updatedImage.id ? updatedImage : img
      )
    );
    setIsEditModalOpen(false);
    setEditingImage(null);
    // Refresh the images list to ensure we have the latest data
    fetchGalleryImages();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingImage(null);
  };

  return (
    <div>
      {/* Fixed Header - positioned to not overlap with sidebar - Hidden on mobile */}
      <div className="hidden lg:block bg-gray-50 fixed top-0 left-64 right-0 z-[200] p-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Images</h1>
        <p className="text-gray-600">Manage your gallery images</p>
      </div>

      {/* Mobile Header - visible only on mobile */}
      <div className="lg:hidden p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Images</h1>
        <p className="text-gray-600">Manage your gallery images</p>
      </div>

      {/* Main Content with responsive top padding */}
      <div className="pt-6 lg:pt-32 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Action Buttons Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={fetchGalleryImages}
                disabled={isLoading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm lg:text-base"
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
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base"
              >
                Delete Multiple
              </button>
              <Link
                href="/admin/gallery/upload"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 lg:px-6 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base text-center"
              >
                ADD
              </Link>
            </div>
          </div>
        </div>

        {/* Gallery Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-4 lg:p-8 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading gallery images...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedImages.length === galleryImages.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    ID
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Name
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Image
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    EDIT
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    DELETE
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {galleryImages.map((image) => (
                  <tr key={image.id} className="hover:bg-gray-50">
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={(e) => handleSelectImage(image.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {image.id}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="max-w-[120px] lg:max-w-none truncate">
                        {image.name}
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 relative rounded-lg overflow-hidden border border-gray-200">
                        {image.url && image.url.trim() !== '' ? (
                          <Image
                            src={image.url}
                            alt={image.alt || image.name || 'Gallery image'}
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
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEditImage(image.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 lg:px-4 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors"
                      >
                        EDIT
                      </button>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 lg:px-4 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors"
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-gray-600 text-center lg:text-left">
            Total Images: {galleryImages.length} | Selected: {selectedImages.length}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <EditImageModal
          image={editingImage}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
