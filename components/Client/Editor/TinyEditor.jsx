"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import dynamic from 'next/dynamic';
import { Eye, Save, XCircle } from 'lucide-react';
import Link from 'next/link';
import { images } from '@/constants';
import { getPostDetail, updatePost } from '@/services/posts';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Error from '../Error';
import { updateRevalidate } from '@/services/revalidate';
import stables from '@/constants/stables';
import Image from 'next/image';



function TinyEditor({ slug }) {
    const editorRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstRun, setIsFirstRun] = useState(true);
    const [post, setPost] = useState(null);
    const router = useRouter();
    const userState = useSelector(state => state.user);
    const [isAuthor, setIsAuthor] = useState(true);
    const [isError, setIsError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const [photo, setPhoto] = useState({ value: '', error: '' });
    const [caption, setCaption] = useState({ value: '', error: '' });
    const [title, setTitle] = useState({ value: '', error: '' });
    const [body, setBody] = useState('');
    const [inputSlug, setInputSlug] = useState({ value: '', error: '' });
    const [tags, setTags] = useState({ value: [], error: '' });
    const [categories, setCategories] = useState(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getPostDetail(slug);
                if (!data?.success) {
                    setIsError(data?.message);
                } else {
                    setPost(data?.data);
                }
                const url = `${stables.BASE_URL}/api/category/getAll?keyword=`;
                const options = {
                    method: 'GET',
                };
                const res = await fetch(url, options);
                const DATA = await res.json();
                setCategories(DATA);
                setIsFirstRun(false);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching post details: ", error);
            }
        };

        if (isFirstRun) {
            fetchData();
        }

        if (!isAuthor) {
            toast.error('Please sign in as Author to edit the blog.');
            router.push(`/blogs/${slug}`);
        }

        if (!userState?.userInfo || !userState?.userInfo?.author) {
            setIsAuthor(false);
        }
    }, [userState, isAuthor, isFirstRun, slug, router]);

    useEffect(() => {
        setPhoto(() => {
            return { value: post?.photo, error: '' }
        })
        setTitle(() => {
            return { value: post?.title, error: '' }
        })
        setInputSlug(() => {
            return { value: post?.slug, error: '' }
        })
        setCaption(() => {
            return { value: post?.caption, error: '' }
        })
        setTags(() => {
            return { value: post?.tags, error: '' }
        })
        setBody(post?.body);
        setSelectedCategory(post?.category?._id);
    }, [post])

    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setTitle({ value: value, error: 'This field cannot be empty' });
            return;
        }
        setTitle(() => {
            return { value: value, error: '' }
        })
    }

    const handlePhotoChange = (e) => {
        const value = e.target.value;
        const pattern = /^(http)(s)?:\/\/.*\.(jpeg|jpg|png)$/i;
        if (!pattern.test(value) && value) {
            setPhoto({ value: value, error: 'E.g: https://i.ibb.co/r3kHyV2/profile.jpg OR .jpeg OR .png' })
            return;
        } else {
            setPhoto(() => {
                return { value: value, error: '' }
            })
        }
    }

    const handleCaptionChange = (e) => {
        const value = e.target.value;
        if (value.length > 120) {
            setCaption({ value: caption.value, error: 'Caption cannot be more than 120 charaters.' })
            return;
        }
        setCaption(() => {
            return { value: value, error: '' }
        })
    }

    const handleSlugChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setInputSlug({ value: value, error: 'Slug cannot be left empty.' })
            return;
        }
        setInputSlug(() => {
            return { value: value, error: '' }
        })
    }


    async function handleUpdateBtn() {
        setIsLoading(true);
        try {
            setBody(editorRef.current.getContent());
            const data = await updatePost(userState.userInfo.token, slug,
                {
                    title: title.value,
                    caption: caption.value,
                    photo: photo.value,
                    tags: tags.value,
                    slug: inputSlug.value,
                    body: editorRef.current.getContent(),
                    category: selectedCategory,
                });
            if (data?.slug !== slug) {
                router.push(`/blogs/edit/${data?.slug}`);
            }
            await updateRevalidate();
            toast.success('Post has been updated.');
        } catch (error) {
            toast.error(error.message)
        }
        setIsLoading(false);
    }


    const handleAddTag = (e) => {
        if (e.key !== 'Enter') {
            return;
        }
        const newTag = e.target.value;
        if (!newTag || newTag[0] === ' ') {
            return;
        }
        let tagsArr = tags.value;
        let flag = true;
        for (let i = 0; i < tagsArr.length; i++) {
            if (tagsArr[i] === newTag) {
                setTags(() => {
                    return { value: tags.value, error: 'Duplicate tags are not allowed.' }
                })
                flag = false;
            }
        }
        if (flag == true) {
            tags.value.push(newTag);
            tags.error = '';
            setTags((prev) => {
                return { ...prev }
            })
            e.target.value = '';
        }
    }

    const handleDeleteTags = (i) => {
        let tagsArr = tags.value;
        let newArr = [];
        tagsArr.map((tag, index) => {
            if (index !== i) {
                newArr.push(tag);
            }
        })
        setTags(() => {
            return { value: newArr, error: '' }
        })
    }

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        console.log(selectedCategory);
    };

    return (
        <div>
            {isLoading ?
                <Loading /> :
                isError !== '' ?
                    <Error message={isError} /> :
                    <>
                        {/* editor navbar with update and preview btn  */}
                        <div className='flex justify-between items-center border-y-2 px-16 py-2 z-[1000] bg-white sticky w-screen top-12 left-0 right-0'>
                            <p className='text-2xl font-bold'>Blog Editor</p>
                            <div className='flex gap-8'>
                                <button
                                    disabled={
                                        title.error ||
                                        caption.error ||
                                        inputSlug.error ||
                                        tags.error ||
                                        photo.error
                                    }
                                    onClick={handleUpdateBtn}
                                    className='text-lg tracking-wider px-3 py-1 text-white rounded-lg bg-primary hover:bg-opacity-95 flex gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
                                    type="button"><p>Update</p><Save /></button>
                                <Link
                                    href={`/blogs/${slug}`}
                                    target={'_blank'}
                                    className='text-lg tracking-wider px-3 py-1 mr-4 text-white rounded-lg bg-gray-500 hover:bg-opacity-90 flex gap-2'
                                    type="button"><p>Preview</p> <Eye /></Link>
                            </div>
                        </div>

                        {/* form part, post inputs  */}
                        <div className='px-8 my-4'>
                            <div className='flex justify-center items-center rounded-2xl w-full group'>
                                <div className=' overflow-hidden relative flex justify-center items-center'>
                                    {<Image className='aspect-video rounded-2xl' width={650} height={600} 
                                    src={
                                        photo.value ? photo.value :
                                            images.samplePost} alt="Post Picture" />
                                    }
                                </div>
                            </div>
                            {/* Cover Photo file type input in old files   */}
                            <div className='px-4 grid gap-6 my-4'>
                                <div className="">
                                    <label className="block text-[#595959] font-semibold mb-1 text-xl" htmlFor="photo">
                                        Cover Photo
                                    </label>
                                    <input
                                        // {...register('photo', {
                                        //     pattern: {
                                        //         value: /^(http)(s)?:\/\/.*\.(jpeg|jpg|png)$/i,
                                        //         message: 'Invalid URL format. E.g: https://i.ibb.co/r3kHyV2/profile.jpg OR .jpeg OR .png',
                                        //     },
                                        // })}
                                        className="p-4 outline-none border border-dark-light rounded-md w-full"
                                        id="photo"
                                        type="text"
                                        placeholder="Cover Photo of Blog"
                                        value={photo.value}
                                        onChange={(e) => handlePhotoChange(e)}
                                    />
                                    {photo.error && <p className="mt-1 text-xs text-red-500">{photo.error}</p>}
                                </div>
                                <div className="">
                                    <label className="block text-[#595959] font-semibold mb-1 text-xl" htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        className="p-4 outline-none border border-dark-light rounded-md w-full"
                                        id="title"
                                        type="text"
                                        placeholder="Title of Blog"
                                        value={title.value}
                                        onChange={(e) => handleTitleChange(e)}
                                    />
                                    {title.error && <p className="mt-1 text-xs text-red-500">{title.error}</p>}
                                </div>
                                <div className='md:grid md:grid-cols-2 md:gap-8'>
                                    <div className="">
                                        <label className="block text-[#595959] font-semibold mb-1 text-xl" htmlFor="caption">
                                            Caption
                                        </label>
                                        <input
                                            // {...register('caption', {
                                            //     maxLength: {
                                            //         value: 60,
                                            //         message: 'Caption cannot be more than 60 characters.',
                                            //     },
                                            // })}
                                            className="p-4 outline-none border border-dark-light rounded-md w-full"
                                            id="caption"
                                            type="text"
                                            placeholder="Caption goes here..."
                                            value={caption.value}
                                            onChange={(e) => handleCaptionChange(e)}
                                        />
                                        {caption.error && <p className="mt-1 text-xs text-red-500">{caption.error}</p>}
                                    </div>
                                    <div className="">
                                        <label className="block text-[#595959] font-semibold mb-1 text-xl" htmlFor="slug">
                                            Slug
                                        </label>
                                        <input
                                            // {...register('newSlug', {
                                            //     required: 'Slug is required.',
                                            // })}
                                            className="p-4 outline-none border border-dark-light rounded-md w-full"
                                            id="slug"
                                            type="text"
                                            placeholder="Slug goes here..."
                                            value={inputSlug.value}
                                            onChange={(e) => handleSlugChange(e)}
                                        />
                                        {inputSlug.error && <p className="mt-1 text-xs text-red-500">{inputSlug.error}</p>}
                                    </div>
                                </div>
                                <div>
                                    <h2 className='block text-[#595959] font-semibold mb-1 text-xl'>Select Category:</h2>
                                    <select className='p-4 outline-none border border-dark-light rounded-md w-full' value={selectedCategory} onChange={handleCategoryChange}>
                                        <option value="">Select a category</option>
                                        {categories?.success ? categories?.data.map((category) => (
                                            <option key={category?._id} value={category?._id}>
                                                {category?.name}
                                            </option>
                                        )) : <option value="" className='text-red-600'>{categories?.message}</option>}
                                    </select>
                                </div>
                                {/* Tags input  */}
                                <div>
                                    <label className="block text-[#595959] font-semibold mb-1 text-xl" htmlFor="slug">
                                        Tags
                                    </label>
                                    <input
                                        className='p-4 outline-none border border-dark-light rounded-md w-full'
                                        type="text"
                                        // value={inputTagValue}
                                        // onChange={handleInputChange}
                                        onKeyDown={(e) => { handleAddTag(e) }}
                                        placeholder="Enter tag and press Enter"
                                    />
                                    {tags.error && <p className="mt-1 text-xs text-red-500">{tags.error}</p>}
                                    <div className='flex gap-3 my-4 flex-wrap'>
                                        {tags.value && tags.value.map((tag, index) => (
                                            <div key={index} className='text-md flex items-center gap-3 bg-gray-200 rounded-lg w-fit px-2 py-1'>
                                                <p>{tag}</p>
                                                <XCircle stroke='#8d8d8d'
                                                    onClick={() => handleDeleteTags(index)}
                                                    className='cursor-pointer hover:bg-[#8d8d8d] rounded-full' />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Editor for body of the blog  */}
                        <div className='px-10 my-4'>
                            <Editor
                                apiKey='hyjc34wear3f8nwflcgz1nfxchunhjxlen09mne2eq3lusq5'
                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue={body}
                                init={{
                                    height: 500,
                                    menubar: true,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'image', 'codesample', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | image | codesample | help ',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
                        </div>
                    </>
            }
        </div>
    );
}

export default dynamic(() => Promise.resolve(TinyEditor), { ssr: false })
