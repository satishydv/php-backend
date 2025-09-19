"use client"
import React, { useRef, useState } from 'react';
import { IoIosTime } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import Image from 'next/image';

const ContactPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [formType, setFormType] = useState<'review'>('review');
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Submit as review
      const reviewFormData = new FormData();
      reviewFormData.append('name', formData.name);
      reviewFormData.append('email', formData.email);
      reviewFormData.append('mobile', formData.mobile);
      reviewFormData.append('subject', formData.subject);
      reviewFormData.append('message', formData.message);
      reviewFormData.append('rating', rating.toString());
      
      if (selectedFile) {
        reviewFormData.append('profileImage', selectedFile);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/reviews`, {
        method: 'POST',
        body: reviewFormData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: result.message || 'Review submitted successfully!'
        });
        // Reset form
        setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
        setRating(0);
        setSelectedFile(null);
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.error || 'Failed to submit review'
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Left Column - Contact Information */}
          {/* Left Column - Contact Information */}
          <div className="p-8">
            <div className="space-y-5">
              
              {/* Call Us */}
              <div className="flex items-start space-x-4">
                <div className="text-orange-500 text-2xl mt-1">
                  <IoCall />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                    CALL US
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    +91 8340265398
                  </p>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="text-orange-500 text-2xl mt-1">
                  <MdOutlineMail />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                    EMAIL
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    support@gharwadevelopment.com
                  </p>
                </div>
              </div>
               {/* Location */}
               <div className="flex items-start space-x-4">
                <div className="text-orange-500 text-2xl mt-1">
                  <FaLocationDot />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                    LOCATION
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Kisaan Complex, Near Block Chowk, Ormanjhi, Ranchi
                  </p>
                </div>
              </div>

               {/* Contact Image */}
               <Image src="/contact.jpg" alt="Contact us illustration" width={500} height={200} className='w-full h-auto rounded-lg' />

             

            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-gray-200 dark:bg-gray-700 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-8">
              SUBMIT REVIEW
            </h2>

            {/* Success/Error Message */}
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitMessage.type === 'success' 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                {submitMessage.text}
              </div>
            )}
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your Name"
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter your Mobile Number"
                    required
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter a valid email address"
                    required
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Review Title (optional)"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your review here..."
                  rows={3}
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                ></textarea>
              </div>
              
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                  Rate our service <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {star <= (hoverRating || rating) ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-500">☆</span>
                      )}
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {rating} star{rating !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              
              {/* File Upload */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-300 flex items-center justify-center space-x-2 text-gray-800 dark:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>{selectedFile ? selectedFile.name : 'Upload Profile Image (optional)'}</span>
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-10">
          <div className="relative w-full overflow-hidden rounded-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.6773810218974!2d85.46672077478361!3d23.472098999404558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4fb3f1f1adb2b%3A0xf996dbc9b9b4c540!2sKisaan%20Complex!5e0!3m2!1sen!2sin!4v1758082645636!5m2!1sen!2sin" 
              width="100%" 
              height="600" 
              style={{border:0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[600px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
