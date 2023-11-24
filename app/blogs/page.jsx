import SearchBox from '@/components/Client/HeroSection/SearchBox';
import PostsDisplay from '@/components/Server/Article/PostsDisplay';
import BreadCrumbs from '@/components/Server/BreadCrumbs';
import React from 'react';

export const metadata = {
  title: 'Read Verve Blogs',
  description: 'This is my first website in nextjs. In Shaa Allah, I will complete this whole project.',
}

export default async function page({ searchParams }) {
  const query = searchParams?.q || '';
  const page = parseInt(searchParams?.p) || 1;
  const limit = parseInt(searchParams?.l) || 9;

  const paths = [
    { link: '/', name: 'Home' },
    { link: '/blogs', name: 'Blogs' }
  ];
  
  return (
    <div>
      <BreadCrumbs data={paths} />
      <div className='w-full flex justify-center items-center'>
        <div className='w-[60%]'>
          <SearchBox />
        </div>
      </div>
      <div>
        <PostsDisplay keyword={query} page={page} limit={limit} />
      </div>
    </div>
  )
}
