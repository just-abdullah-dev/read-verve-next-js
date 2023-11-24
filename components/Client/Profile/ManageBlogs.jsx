"use client";
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Link from 'next/link';
import ManageBlogsSkeleton from './ManageBlogsSkeleton';
import { useSelector } from 'react-redux';
import { PenBoxIcon, Trash2Icon } from 'lucide-react';
import ReactSwitch from 'react-switch';
import { images } from '@/constants';
import Pagination from '@/components/Server/Article/Pagination';
import dynamic from 'next/dynamic';
import { deletePost, getAllPosts, updatePost } from '@/services/posts';
import Error from '../Error';
import { updateRevalidate } from '@/services/revalidate';
import Image from 'next/image';


function ManageBlogs() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const userState = useSelector(state => state.user);
    const [postsData, setPostsData] = useState({ data: [], status: {} });
    const [isPostLoading, setIsPostLoading] = useState(true);
    const [totalPageCount, setTotalPageCount] = useState(1);
    const [btnEffect, setBtnEffect] = useState(false);

    const { mutate: mutateUpdatePostStatus, isLoading: isLoadingUpdatePostStatus } = useMutation({
        mutationFn: ({ token, slug, publish }) => {
            return updatePost(token, slug, {publish});
        },
        onSuccess: (data) => {
            toast.success('Blog status has been updated.');
            console.log(data);
            setSearchKeyword(' ');
            setBtnEffect(false);
            updateRevalidate();
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message);
        },
    });
    function handleUpdatePostStatus(slug, publish) {
        setBtnEffect(true);
        const answer = publish ? 'no':'yes';
        mutateUpdatePostStatus({
            token: userState.userInfo.token,
            slug,
            publish: answer
        });
    }

    useEffect(
        () => {
            (async () => {
                setIsPostLoading(true);
                try {
                    if(searchKeyword === ' '){
                        setSearchKeyword('');
                    }
                    const { data, headers } = await getAllPosts(searchKeyword, currentPage, 5);
                    if (data?.success) {
                        const total = headers.get('x-totalpagecount');
                        setTotalPageCount(total);
                        setPostsData(() => {
                            return {
                                data: data?.data,
                                status: {
                                    success: true,
                                }
                            }
                        });
                        setIsPostLoading(false);
                    } else {
                        setPostsData(() => {
                            return {
                                data: [],
                                status: {
                                    success: false,
                                    message: data?.message,
                                }
                            }
                        })
                        setIsPostLoading(false);
                    }
                } catch (error) {
                    toast.error('Error occur while fetching post data.');
                }
            })();
        }, [currentPage, searchKeyword]
    );

    const { mutate: mutateDeletePost, isLoading: isDeletingPost } = useMutation({
        mutationFn: ({ token, slug }) => {
            return deletePost(token, slug);
        },
        onSuccess: (data) => {
            toast.success('Blog has been deleted successfully.');
            setCurrentPage(currentPage);
            setSearchKeyword(' ');
            setBtnEffect(false);
            updateRevalidate();
            
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
    function handleDeletePost(slug) {
        if(window.confirm('Are you sure to delete post and its all comments?')){
            setBtnEffect(true);
            const { token } = userState.userInfo;
            mutateDeletePost({ token, slug });
        }
    }
    function handleSearchBtn(e) {
        e.preventDefault();
        setCurrentPage(1);
    }
    return (
        <div className="my-8 mx-4">
            <div className="rounded-xl shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] p-4 pb-8">
                <div className="flex flex-col md:flex-row gap-y-5 justify-between items-center w-full p-4">
                    <h2 className="text-2xl font-semibold">
                        Manage Blogs
                    </h2>
                    <form onSubmit={handleSearchBtn} className="flex gap-6">
                        <input type="text" id="&quot;form-subscribe-Filter"
                            className="py-2 px-4 rounded-lg outline-none border border-gray-300"
                            placeholder="Search Blog"
                            value={searchKeyword}
                            onChange={(e) => { setSearchKeyword(e.target.value) }} />
                        <button
                            className="py-2 px-4 rounded-lg bg-primary hover:bg-opacity-95 text-white font-semibold" type="submit">
                            Search
                        </button>
                    </form>
                </div>
                <div className="">
                    {isPostLoading ?
                        <ManageBlogsSkeleton title={false} /> :
                        <div>
                            <div className='flex gap-1 border-y-2'>
                                <div className='w-2/4 sm:w-3/5 px-2 py-3 border-r-2 text-md font-semibold'><h2>Title</h2></div>
                                <div className='hidden sm:block w-1/5 px-2 py-3 border-r-2 text-md font-semibold'><h2>Category</h2></div>
                                <div className='hidden sm:block w-1/5 px-2 py-3 border-r-2 text-md font-semibold'><h2>Date</h2></div>
                                <div className='w-1/5 px-2 py-3 border-r-2 text-md font-semibold'><h2>Status</h2></div>
                                <div className='w-1/5 px-2 py-3 text-md font-semibold'><h2>Action</h2></div>
                            </div>
                            <div>
                                {postsData.status?.success ?
                                    postsData.data && postsData.data.map((post) =>
                                        <div key={post._id} className={`${btnEffect?'opacity-40':''} flex gap-1 border-b-2 `}>
                                            <div className='w-2/4 sm:w-3/5 px-2 py-3 text-md flex gap-2 items-center'>
                                                <Image width={56} height={56} className='aspect-square rounded-lg' src={post.photo ? post.photo : images.samplePost} alt="post image" />
                                                <div className=''>
                                                    <Link href={`/blogs/${post.slug}`} className={'font-semibold'}>
                                                        {post.title}
                                                    </Link>
                                                    <p className='sm:hidden text-sm text-gray-500'>
                                                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}</p>
                                                </div>

                                                <h2 className='font-semibold'></h2>
                                            </div>

                                            <div className='hidden w-1/5 px-2 py-3 text-sm sm:flex items-center'><p>{post?.category ? post?.category?.name : 'Uncategorized'}</p></div>

                                            <div className='w-1/5 px-2 py-3 text-sm hidden sm:flex items-center'><p>
                                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}</p></div>
                                            <div className='w-1/5 px-2 py-3 text-sm flex items-center justify-center'>
                                                <ReactSwitch
                                                    className='disabled:opacity-60 disabled:cursor-not-allowed'
                                                    disabled={isLoadingUpdatePostStatus}
                                                    height={22}
                                                    width={44}
                                                    checked={post.publish}
                                                    uncheckedIcon={false}
                                                    checkedIcon={false}
                                                    onColor='#1565d8'
                                                    onChange={() => handleUpdatePostStatus(post.slug, post.publish)} />
                                            </div>
                                            <div className='w-1/5 px-2 py-3 text-sm flex items-center justify-center'>
                                                <div className='flex gap-4'>
                                                    <Link href={`/blogs/edit/${post.slug}`} target='_blank'>
                                                        <PenBoxIcon
                                                            strokeWidth={2}
                                                            size={19} />
                                                    </Link>
                                                    <button
                                                        className='disabled:opacity-70 disabled:cursor-not-allowed'
                                                        disabled={isDeletingPost}
                                                        onClick={() => handleDeletePost(post.slug)}
                                                        type="button">
                                                        <Trash2Icon
                                                            strokeWidth={2}
                                                            size={19} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) :
                                    <Error message={postsData?.status?.message} />}
                            </div>
                        </div>
                    }
                    {totalPageCount > 1 ?
                        <Pagination
                            onParams={false}
                            onPageChange={(page) => setCurrentPage(page)}
                            currentPage={currentPage}
                            totalPageCount={totalPageCount}
                        /> :
                        null}
                </div>
            </div>
        </div>
    )
}

export default dynamic(() => Promise.resolve(ManageBlogs), { ssr: false })

