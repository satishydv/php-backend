'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2, 
  Star,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  Image as ImageIcon,
  Filter,
  Search
} from "lucide-react";

interface Review {
  id: number;
  name: string;
  email: string;
  mobile: string;
  subject: string | null;
  message: string;
  rating: number;
  profile_image: string | null;
  status: 'pending' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const fetchReviews = async (page = 1, status = '', search = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      let url = `${apiUrl}/admin/reviews?page=${page}&limit=${pagination.limit}`;
      if (status) url += `&status=${status}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      console.log('API Response:', response.status, data);
      
      if (response.ok) {
        let filteredReviews = data.reviews || [];
        
        // Client-side search filtering
        if (search) {
          filteredReviews = filteredReviews.filter((review: Review) =>
            review.name.toLowerCase().includes(search.toLowerCase()) ||
            review.email.toLowerCase().includes(search.toLowerCase()) ||
            review.message.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        setReviews(filteredReviews);
        setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
        setError(null); // Clear any previous errors
      } else {
        console.error('API Error:', response.status, data);
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          setError('Session expired. Please log in again.');
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setError(data.error || `Failed to fetch reviews (Status: ${response.status})`);
        }
      }
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(pagination.page, statusFilter, searchTerm);
  }, [pagination.page, statusFilter]);

  const handleStatusChange = async (reviewId: number, newStatus: 'active' | 'inactive') => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/admin/reviews`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: reviewId,
          status: newStatus
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update the review in the local state
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, status: newStatus }
            : review
        ));
      } else {
        setError(data.error || 'Failed to update review status');
      }
    } catch (err) {
      setError('Failed to update review status');
      console.error('Error updating review:', err);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/admin/reviews?id=${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        // Remove the review from the local state
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      } else {
        setError(data.error || 'Failed to delete review');
      }
    } catch (err) {
      setError('Failed to delete review');
      console.error('Error deleting review:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Fixed Header - positioned to not overlap with sidebar - Hidden on mobile */}
      <div className="hidden lg:block bg-gray-50 fixed top-0 left-64 right-0 z-[200] p-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Management</h1>
        <p className="text-gray-600">Manage customer reviews and testimonials</p>
      </div>

      {/* Mobile Header - visible only on mobile */}
      <div className="lg:hidden p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Management</h1>
        <p className="text-gray-600">Manage customer reviews and testimonials</p>
      </div>

      {/* Main Content with responsive top padding */}
      <div className="pt-6 lg:pt-32 p-6">

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            {error.includes('token') && (
              <Button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Go to Login
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button
            onClick={() => fetchReviews(1, statusFilter, searchTerm)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {reviews.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">No reviews match your current filters.</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {review.profile_image ? (
                            <img
                              src={`/${review.profile_image}`}
                              alt={review.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{review.name}</h3>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500 ml-1">({review.rating}/5)</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                          {review.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {review.subject || 'Review'}
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {review.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {review.mobile}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(review.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {review.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleStatusChange(review.id, 'active')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleStatusChange(review.id, 'inactive')}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {review.status === 'active' && (
                        <Button
                          onClick={() => handleStatusChange(review.id, 'inactive')}
                          size="sm"
                          variant="outline"
                          className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Hide
                        </Button>
                      )}
                      
                      {review.status === 'inactive' && (
                        <Button
                          onClick={() => handleStatusChange(review.id, 'active')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Show
                        </Button>
                      )}

                      <Button
                        onClick={() => handleDeleteReview(review.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} reviews
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => fetchReviews(pagination.page - 1, statusFilter, searchTerm)}
              disabled={pagination.page === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              onClick={() => fetchReviews(pagination.page + 1, statusFilter, searchTerm)}
              disabled={pagination.page === pagination.totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
