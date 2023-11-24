import React from 'react';
import BreadCrumbs from '../BreadCrumbs';
import { images } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, User2 } from 'lucide-react';
import CommentInput from '@/components/Client/Comment/CommentInput';
import AllComments from '@/components/Client/Comment/AllComments';
import SocialMediaShareButtons from '../SocialMediaShareButtons';
import SuggestedPosts from '../SuggestedPosts';

export default function ArticleView({ post, slug }) {


  const breadCrumbsData = [
    { link: '/', name: 'Home' },
    { link: '/blogs', name: 'Blogs' },
    { link: `/blogs/${slug}`, name: slug },
  ];

  return (
    <div className='my-0'>
      <BreadCrumbs data={breadCrumbsData ? breadCrumbsData : []} />
      <div className='grid lg:flex items-start gap-6 py-6 px-8 md:px-12'>
        <div className='grid gap-4 lg:w-[66%]'>
          {post?.category &&
          <div>
          <Link
            href={`/categories/${post?.category?.slug}`}
            className='font-bold text-primary px-4 py-2 bg-secondary rounded-lg m-1 hover:bg-primary hover:text-white'>
            {post?.category?.name}
          </Link>
        </div>}
          <div className='grid gap-2'>
            <h1 className='text-5xl font-semibold '>{post?.title}</h1>
            <h1 className='text-lg '>{post?.caption}</h1>
          </div>
          <div className='flex justify-center items-center w-full'>
            <Image
              className='rounded-2xl aspect-video'
              alt='Article Image'
              width={800}
              height={500}
              src={post.photo ? post.photo : images.samplePost} />
          </div>
          <div className='flex justify-start items-center gap-3 opacity-85 mx-8'>
            {post.user.avatar ?
              <Image
                width={42}
                height={42}
                className='rounded-full'
                src={post.user.avatar}
                alt="Author Image" /> :
              <div className='outline outline-2 rounded-full'><User2 /></div>}
            <div className='flex justify-between items-center w-full'>
              <div className='flex gap-6'>
                <Link href='/about' className='text-md font-semibold hover:scale-[98%] cursor-pointer'>{post.user.name.split(" ")[0]}</Link>
                {post.user.verified &&
                  <div className='flex gap-1 items-center'>
                    <BadgeCheck size={20} color='#ffffff' fill='#11ed11' />
                    <p className='text-xs text-dark-light'>Verified</p>
                  </div>}
              </div>
              <div className='font-semibold text-dark-hard text-sm flex gap-2'>
                <p>Last Updated: </p>
                <p className=''>
                  {(new Date(post.updatedAt).getDate())} {" "}
                  {(new Date(post.updatedAt).toLocaleString("default", { month: "short", }))} {" "}
                  {(new Date(post.updatedAt).getFullYear() % 100)}
                </p>
              </div>
            </div>
          </div>
          <hr />

          <div 
            className='text-md'
            id='body-of-blog'
            dangerouslySetInnerHTML={{ __html: post?.body }}
            >
          </div>

          <CommentInput
            slug={slug}
            typeOfComment={'new'}
            commentLabel={'Leave your comment here...'}
            buttonLabel={'Send'} />

          <AllComments
            slug={slug}
            comments={post?.comments} />
        </div>
        <div className='lg:w-[34%] py-4 grid gap-y-6 lg:flex lg:flex-col-reverse mt-20'>
          <SocialMediaShareButtons
            url={'https://moonfo.com/post/client-side-and-server-side-explanation'}
            title={'Client-side and Server-side explanation'} />

          <SuggestedPosts
            slug={slug}
            title={'Latest Article'}
            tags={post.tags ? post.tags : ['one', 'two', 'three']} />

        </div>
      </div>
    </div>
  )
}
