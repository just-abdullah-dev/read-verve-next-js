import Error from '@/components/Client/Error';
import ArticleCard from '@/components/Server/Article/ArticleCard';
import stables from '@/constants/stables';
import React from 'react';

export const metadata = {
    title: 'Read Verve Categories',
    description: 'This is my first website in nextjs. In Shaa Allah, I will complete this whole project.',
}

export default async function page() {
    const url = `${stables.BASE_URL}/api/posts/getAllPosts?searchKeyword=&page=1&limit=100`;
    const options = {
        method: 'GET',
    };

    const res = await fetch(url, options);
    const posts = await res.json();

    const url2 = `${stables.BASE_URL}/api/category/getAll?keyword=`;
    const options2 = {
        method: 'GET',
    };

    const res2 = await fetch(url2, options2);
    const categories = await res2.json();

    return (
        <div>
            <div className='flex items-center justify-center my-8'>
                <div className='w-[60%] rounded-xl bg-white px-8 py-6 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]'>
                    <p className='font-bold text-lg'>Categories: </p>
                    <div className='flex flex-wrap items-center gap-2'>
                        {
                            categories?.data.map((category, index) => (
                                <a
                                    href={`#${category.slug}`}
                                    key={index}
                                    className='font-bold text-primary px-4 py-2 bg-secondary rounded-lg m-1 hover:bg-primary hover:text-white'>
                                    {category.name}
                                </a>
                            ))
                        }
                        <a href='#others' className='font-bold text-primary px-4 py-2 bg-secondary rounded-lg m-1 hover:bg-primary hover:text-white'>
                            Others
                        </a>
                    </div>
                </div>

            </div>
            <div>
                {(!categories?.success && !posts?.success) ?
                    <Error message={categories?.message + posts?.message} /> :
                    categories?.data.map((category) => {
                        return (
                            <div key={category.slug} id={category.slug} className='grid gap-6 my-12'>
                                <div className='font-bold text-primary px-4 py-2 bg-secondary rounded-lg m-1 hover:bg-primary hover:text-white w-fit ml-20 cursor-pointer'>
                                    {category?.name}
                                </div>
                                <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-14 '>
                                    {posts?.data.map((post) => {
                                        if (post?.category?._id == category?._id) {
                                            if (post.publish) {
                                                return <ArticleCard key={post._id} post={post} />
                                            }
                                        }
                                    })}
                                </div>
                            </div>)
                    })
                }

            </div>
            <div>
                <div id='others' className='font-bold text-primary px-4 py-2 bg-secondary rounded-lg m-1 hover:bg-primary hover:text-white w-fit ml-20'>
                    Others
                </div>
                <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-14 m-6'>
                    {posts?.data.map((post) => {
                        if (post?.category == null) {
                            return <ArticleCard key={post._id} post={post} />
                        }
                    })}
                </div>
            </div>
        </div>
    )
}
