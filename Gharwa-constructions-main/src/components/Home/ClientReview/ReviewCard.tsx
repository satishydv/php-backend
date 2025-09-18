import Image from 'next/image';
import React from 'react'

type Props = {
    name: string;
    heading: string;
    review: string;
    rating: number;
    avatar: string;
}

const ReviewCard = ({name, heading, review, rating, avatar}: Props) => {
  return (
    <div className='bg-gray-100 dark:bg-gray-900 p-6 rounded-lg mr-4 shadow-md h-80 flex flex-col'>
        <h1 className='text-xl font-bold'>{heading}</h1>
        <div className='flex items-center mt-2'>
        <p className='text-yellow-500'>{"⭐".repeat(rating)}</p>
        </div>
        <p className='text-gray-800 font-medium dark:text-gray-300 mt-4 flex-grow'>
            {review}
        </p>
        <p className='block w-full h-[1px] bg-gray-300 dark:bg-gray:700 mt-6 mb-6'></p>
        <div>
            <div className='flex items-center space-x-4'>
            <Image src={avatar} alt={name} width={50} height={50} className='rounded-full'/>
            <div >
                <h1 className='text-lg font-bold'>{name}</h1>
                
               
            </div>
            </div>
        </div>
    </div>
  )
}

export default ReviewCard