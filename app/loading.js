import HeroSkeleton from '@/components/Server/Article/HeroSkeleton';
import PostDisplaySkeleton from '@/components/Server/Article/PostDisplaySkeleton';
import React from 'react';

export default function loading() {
  return (
    <div className='my-8'>
      <HeroSkeleton showImageSkeleton={true} />
      <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-14 mb-10'>
        {Array(6).fill().map((_, index) => (
          <PostDisplaySkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
