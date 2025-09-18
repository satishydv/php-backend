'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  name: string;
  filename: string;
  url: string;
  alt: string;
}

interface EditImageModalProps {
  image: GalleryImage;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedImage: GalleryImage) => void;
}

export default function EditImageModal({ image, isOpen, onClose, onSave }: EditImageModalProps) {
  const [formData, setFormData] = useState({
    name: image.name,
    alt: image.alt,
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
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
    
    setIsUploading(true);

    try {
      let updatedImage: GalleryImage = {
        ...image,
        name: formData.name,
        alt: formData.alt,
      };

      // If a new image file is selected, replace the image
      if (selectedFile) {
        try {
          // 1. Delete the old image file from public/Gallery folder
          await deleteOldImage(image.filename);
          
          // 2. Upload the new image with the same filename
          const newImageUrl = await uploadNewImage(selectedFile, image.filename, formData.name, formData.alt);
          
          // 3. Update the image with new URL
          updatedImage = {
            ...updatedImage,
            url: newImageUrl,
          };

          console.log('Image replaced successfully:', {
            oldFile: image.filename,
            newFile: selectedFile.name,
            newUrl: newImageUrl
          });
        } catch (error) {
          console.error('Error replacing image:', error);
          alert('Failed to replace image file. Please try again.');
          setIsUploading(false);
          return;
        }
      } else {
        // If no new file selected, just update the database with new name/alt
        try {
          await updateImageMetadata(image.filename, formData.name, formData.alt);
        } catch (error) {
          console.error('Error updating image metadata:', error);
          alert('Failed to update image metadata. Please try again.');
          setIsUploading(false);
          return;
        }
      }

      onSave(updatedImage);
      onClose();
      
      // Set flag to refresh gallery page
      sessionStorage.setItem('gallery-refresh-needed', 'true');
      
      alert('Image updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to delete old image file
  const deleteOldImage = async (filename: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Create a FormData to send the delete request
      const formData = new FormData();
      formData.append('filename', filename);
      
      const response = await fetch('/api/admin/gallery/delete-image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to delete old image');
      }

      console.log('Old image deleted:', filename);
    } catch (error) {
      console.error('Error deleting old image:', error);
      throw error;
    }
  };

  // Function to update image metadata only
  const updateImageMetadata = async (filename: string, name: string, alt: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch('/api/admin/gallery/update-metadata', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          name,
          alt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update image metadata');
      }

      console.log('Image metadata updated successfully');
    } catch (error) {
      console.error('Error updating image metadata:', error);
      throw error;
    }
  };

  // Function to upload new image
  const uploadNewImage = async (file: File, filename: string, name: string, alt: string): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Create a FormData to send the upload request
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      uploadFormData.append('imageId', image.id.toString()); // Send image ID for replacement
      uploadFormData.append('originalFilename', filename); // Send original filename for replacement
      uploadFormData.append('name', name);
      uploadFormData.append('alt', alt);
      
      const response = await fetch('/api/admin/gallery/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload new image');
      }

      const result = await response.json();
      console.log('New image uploaded:', result.url);
      
      return result.url;
    } catch (error) {
      console.error('Error uploading new image:', error);
      throw error;
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center pt-25 justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Image</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Image Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 relative rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Current Filename:</strong> {image.filename}</p>
                  <p><strong>Current Name:</strong> {image.name}</p>
                  <p><strong>Current Alt:</strong> {image.alt}</p>
                </div>
              </div>
            </div>

            {/* New Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Replace with New Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="edit-image-upload"
                />
                <label
                  htmlFor="edit-image-upload"
                  className="cursor-pointer block"
                >
                  {preview ? (
                    <div className="space-y-4">
                      <div className="w-32 h-32 mx-auto relative rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        New image preview - Click to change
                      </p>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Remove New Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Click to upload new image
                        </p>
                        <p className="text-xs text-gray-500">
                          Will replace current image while keeping filename: {image.filename}
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Image Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Image Name *
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter image name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-alt" className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text *
                </label>
                <input
                  type="text"
                  id="edit-alt"
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
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter image description (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Image</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Edit Information:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Filename will remain:</strong> {image.filename}</li>
            <li>• <strong>New image will replace:</strong> Current image file</li>
            <li>• <strong>Gallery position:</strong> Stays the same</li>
            <li>• <strong>Supported formats:</strong> JPG, PNG, WebP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
