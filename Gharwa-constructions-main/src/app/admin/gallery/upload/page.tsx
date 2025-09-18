'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadGalleryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    alt: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for upload
      const uploadFormData = new FormData();
      uploadFormData.append('image', selectedFile);
      uploadFormData.append('name', formData.name);
      uploadFormData.append('alt', formData.alt);

      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }

      // Upload image using API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/admin/gallery/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('Image uploaded successfully:', result);
      
      // Set flag to refresh gallery page when returning
      sessionStorage.setItem('gallery-refresh-needed', 'true');
      
      alert('Image uploaded successfully!');
      router.push('/admin/gallery');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {/* Fixed Header - positioned to not overlap with sidebar - Hidden on mobile */}
      <div className="hidden lg:block bg-gray-50 fixed top-0 left-64 right-0 z-[200] p-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Image</h1>
        <p className="text-gray-600">Add a new image to your gallery</p>
      </div>

      {/* Mobile Header - visible only on mobile */}
      <div className="lg:hidden p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Image</h1>
        <p className="text-gray-600">Add a new image to your gallery</p>
      </div>

      {/* Main Content with responsive top padding */}
      <div className="pt-6 lg:pt-32 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/admin/gallery"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Gallery</span>
            </Link>
          </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                  required
                />
                <div
                  className="cursor-pointer block"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                >
                  {preview ? (
                    <div className="space-y-4">
                      <div className="w-48 h-48 mx-auto relative rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Drop your image here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports JPG, PNG, WebP up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Image Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter image name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text *
                </label>
                <input
                  type="text"
                  id="alt"
                  name="alt"
                  value={formData.alt}
                  onChange={handleInputChange}
                  placeholder="Enter alt text for accessibility"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter image description (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Upload Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/gallery"
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-8 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload Image</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Upload Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Upload Guidelines:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Supported formats: JPG, PNG, WebP</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Recommended dimensions: 800x600 or larger</li>
            <li>• Images will be automatically renamed to gallery-X format</li>
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
}
