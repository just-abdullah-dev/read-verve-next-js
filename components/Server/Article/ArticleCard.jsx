import React from 'react';
import Link from 'next/link';
import { BadgeCheck, User2 } from 'lucide-react';
import { images } from '@/constants';
import Image from 'next/image';

export default function ArticleCard({ post }) {
    return (
        <div className='flex justify-center items-start'>
            <div className='flex flex-col items-center justify-center shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] w-72 rounded-2xl overflow-hidden bg-white pb-1'>
                <Link href={`/blogs/${post.slug}`} className='w-full aspect-video relative overflow-hidden'>
                    <Image
                    width={290}
                    height={275}
                    src={post.photo ? post.photo : images.samplePost} 
                    alt="Article Image" />
                </Link>
                <div className='py-5 px-3 flex flex-col gap-3 w-full'>
                    <Link href={`/blogs/${post.slug}`} className='cursor-pointer hover:text-dark-soft text-xl font-bold text-dark-hard max-h-14 overflow-hidden'>{post.title}</Link>
                    <p className='text-dark-light max-h-12 overflow-hidden'>{post.caption}</p>

                    <div className='flex justify-start items-center gap-3'>
                        {post.user.avatar ? 
                        <Image
                        width={40}
                        height={40}
                        className='rounded-full' 
                        src={post.user.avatar} 
                        alt="Author Image" />: 
                        <div className='outline outline-2 rounded-full'><User2 size={32} strokeWidth={1.6} /></div>}
                        <div className='flex justify-between items-center w-full'>
                            <div>
                                <Link href='/about' className='text-md font-bold hover:scale-[98%] cursor-pointer'>{post.user.name.split(" ")[0]}</Link>
                                {post.user.verified &&
                                    <div className='flex gap-1 items-center'>
                                        <BadgeCheck size={20} color='#ffffff' fill='#11ed11' />
                                        <p className='text-xs text-dark-light'>Verified</p>
                                    </div>}
                            </div>
                            <p className='font-semibold text-dark-hard text-sm'>
                                {(new Date(post.updatedAt).getDate())} {" "}
                                {(new Date(post.updatedAt).toLocaleString("default", {month:"short",}))} {" "}
                                {(new Date(post.updatedAt).getFullYear()%100 )}
                                </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}