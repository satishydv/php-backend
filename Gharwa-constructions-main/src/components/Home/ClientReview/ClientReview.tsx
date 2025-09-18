'use client'
import React, { useState, useEffect } from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ReviewCard from './ReviewCard';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

// Interface for review data from API
interface ReviewData {
    id: number;
    name: string;
    subject: string;
    message: string;
    rating: number;
    profile_image: string | null;
    created_at: string;
}

const ClientReview = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        
        if (response.ok) {
          setReviews(data.reviews || []);
        } else {
          setError(data.error || 'Failed to fetch reviews');
        }
      } catch (err) {
        setError('Failed to fetch reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Fallback data if no reviews are available
  const fallbackReviews = [
    {
        id: 1,
        name: "Abhishek Pandey",
        subject: "Great Service!",
        message: "Gharwa Development Pvt. Ltd. is a great company to work with. They are very professional and they have a great team of engineers and architects.",
        rating: 5,
        profile_image: "/images/c1.png",
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        name: "Shariq Rehan",
        subject: "Good Experience",
        message: "Gharwa Development Pvt. Ltd. is a great company to work with. They are very professional and they have a great team of engineers and architects.",
        rating: 4,
        profile_image: "/images/c2.png",
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        name: "Pranjal Srivastava",
        subject: "Highly Recommend",
        message: "Great company to work with. They are very professional and they have a great team of engineers and architects.",
        rating: 5,
        profile_image: "/images/c3.png",
        created_at: new Date().toISOString()
    },
    {
        id: 4,
        name: "Pranjal Srivastava",
        subject: "Highly Recommend",
        message: "Great company to work with. They are very professional and they have a great team of engineers and architects.",
        rating: 5,
        profile_image: "/images/c3.png",
        created_at: new Date().toISOString()
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  if (loading) {
    return (
      <div className='pt-16 pb-16'>
        <h1 className='text-xl sm:text-2xl text-center font-extrabold'>What people say about us</h1>
        <div className='w-[90%] md:w-[70%] mx-auto mt-16 flex justify-center'>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Review loading error:', error);
  }

  return (
    <div className='pt-16 pb-16'>
        <h1 className='text-xl sm:text-2xl md:text-4xl text-center text-orange-500 font-extrabold'>What people say about us</h1>
        <div className='w-[90%] md:w-[70%] mx-auto mt-16 '>
            <Carousel
              showDots={false}
              responsive={responsive}
              infinite={displayReviews.length > 3}
              autoPlay={displayReviews.length > 1}
              autoPlaySpeed={4000}
            >
                {displayReviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        name={review.name}
                        heading={review.subject || 'Review'}
                        review={review.message}
                        rating={review.rating}
                        avatar={review.profile_image || '/images/c1.png'}
                    />
                ))}
            </Carousel>
        </div>
    </div>
  )
}

export default ClientReview