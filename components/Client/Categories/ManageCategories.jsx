"use client";
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { CrossIcon, PenBoxIcon, Plus, Trash2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Error from '../Error';
import { updateRevalidate } from '@/services/revalidate';
import Loading from '@/components/Loading';
import { deleteCategory, getAllCategories, updateCategory } from '@/services/categories';
import CreateCategory from './CreateCategory';


function ManageCategories() {
    const [searchKeyword, setSearchKeyword] = useState('');
    const userState = useSelector(state => state.user);


    const [isLoading, setIsLoading] = useState(true);
    const [isFirstRun, setIsFirstRun] = useState(true);
    const [categories, setCategories] = useState(null);
    const [isError, setIsError] = useState('');
    const [isSelected, setIsSelected] = useState({
        id: '',
        name: '',
        slug: '',
    });

    async function handleDeleteCategory(id) {
        if (window.confirm('Are you sure to delete this category?')) {
            try {
                setIsLoading(false);
                const { token } = userState.userInfo;
                const data = await deleteCategory(token, id);
                if (!data?.success) {
                    toast.error(data?.message);
                } else {
                    toast.success(data?.message);
                    setIsLoading(false);
                    setIsFirstRun(true);
                    updateRevalidate();
                }
            } catch (error) {
                toast.error(error?.message)
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getAllCategories(searchKeyword);
                if (!data?.success) {
                    setIsError(data?.message);
                } else {
                    setIsError('');
                    setCategories(data?.data);
                }
                setIsFirstRun(false);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching categories: ", error);
            }
        };

        if (isFirstRun || !searchKeyword) {
            fetchData();
        }
    }, [userState, isFirstRun, searchKeyword]);

    async function handleUpdateCategory() {
        try {
            setIsLoading(true);
            const data = await updateCategory(userState.userInfo.token,
                {
                    id: isSelected.id,
                    name: isSelected.name,
                    slug: isSelected.slug,
                });
            updateRevalidate();
            setIsFirstRun(true);
        } catch (error) {
            toast.error(error?.message)
        }
        setIsLoading(false);
    }

    const [createCategory, setCreateCategory] = useState(false);
    return (
        <div className="my-8 mx-4">
            <div className="rounded-xl shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] p-4 pb-8">
                <div>
                    <button
                        onClick={() => {
                            setCreateCategory(true);
                        }}
                        value={createCategory}
                        className={`${createCategory ? 'bg-primary text-white' : ''} flex gap-1 py-2 px-3 md:gap-2 items-center cursor-pointer rounded-xl shadow-[rgba(17,_17,_26,_0.2)_0px_0px_16px]`}>
                        <p className='text-md font-bold'>Create a New Category</p> <Plus />
                    </button>
                    {createCategory &&
                    <div className='relative'>
                       <button type="button" onClick={() => {
                                setCreateCategory(false);
                        }}> <CrossIcon className='absolute top-0 right-0 rotate-45' stroke='0' fill='#ff0000' size={32} /></button>
                        <CreateCategory />
                    </div>}
                </div>
                <div className="flex flex-col md:flex-row gap-y-5 justify-between items-center w-full p-4">
                    <h2 className="text-2xl font-semibold">
                        Manage Categories
                    </h2>
                    <form onSubmit={(e) => { e.preventDefault(); setIsFirstRun(true); }} className="flex gap-6">
                        <input type="text" id="&quot;form-subscribe-Filter"
                            className="py-2 px-4 rounded-lg outline-none border border-gray-300"
                            placeholder="Search Category"
                            value={searchKeyword}
                            onChange={(e) => { setSearchKeyword(e.target.value) }} />
                        <button
                            className="py-2 px-4 rounded-lg bg-primary hover:bg-opacity-95 text-white font-semibold" type="submit">
                            Search
                        </button>
                    </form>
                </div>
                <div className="">
                    {isLoading ?
                        <Loading /> :
                        isError ?
                            <Error message={isError} /> :
                            <div>
                                <div className='flex gap-1 border-y-2'>
                                    <div className='w-1/3 px-2 py-3 border-r-2 text-md font-semibold'><h2>Name</h2></div>
                                    <div className='w-1/3 px-2 py-3 border-r-2 text-md font-semibold'><h2>Slug</h2></div>
                                    <div className='w-1/3 px-2 py-3 text-md font-semibold'><h2>Action</h2></div>
                                </div>
                                <div>
                                    {categories && categories.map((category, index) =>
                                        <div key={category._id} className=' border-b-2' >
                                            <div className={` flex gap-1 `}>

                                                <div className='w-1/3 px-2 py-3 text-md flex items-center'>
                                                    <p>{category.name}</p>
                                                </div>
                                                <div className='w-1/3 px-2 py-3 text-md sm:flex items-center'>
                                                    <p>{category?.slug}</p>
                                                </div>

                                                <div className='w-1/3 px-2 py-3 text-md flex items-center justify-center'>
                                                    <div className='flex gap-4'>
                                                        <button type="button" onClick={() => setIsSelected(() => {
                                                            return { id: category._id, name: category.name, slug: category.slug }
                                                        })}>
                                                            <PenBoxIcon
                                                                strokeWidth={2}
                                                                size={19} />
                                                        </button>

                                                        <button
                                                            className='disabled:opacity-70 disabled:cursor-not-allowed'
                                                            disabled={isLoading}
                                                            onClick={() => handleDeleteCategory(category._id)}
                                                            type="button">
                                                            <Trash2Icon
                                                                strokeWidth={2}
                                                                size={19} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Update category data */}
                                            {isSelected.id === category._id &&
                                                <div className='flex justify-around items-center py-2'>
                                                    <div className='flex items-center gap-3 '>
                                                        <label className='text-[#595959] font-semibold' htmlFor="name">Name</label>
                                                        <input className='p-2 outline-none border border-dark-light rounded-md' type="text" id="name" value={isSelected.name} onChange={(e) => {
                                                            setIsSelected((prev) => {
                                                                return { ...prev, name: e.target.value }
                                                            })
                                                        }} />
                                                    </div>
                                                    <div className='flex items-center gap-3 '>
                                                        <label htmlFor="slug" className='text-[#595959] font-semibold'>Slug</label>
                                                        <input className='p-2 outline-none border border-dark-light rounded-md' type="text" id="slug" value={isSelected.slug} onChange={(e) => {
                                                            setIsSelected((prev) => {
                                                                return { ...prev, slug: e.target.value }
                                                            })
                                                        }} />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className='p-2 text-sm rounded-lg bg-red-600 text-white'
                                                        onClick={() => setIsSelected(() => {
                                                            return { id: '', name: '', slug: '' }
                                                        })}
                                                    >Cancel</button>
                                                    <button
                                                        disabled={isLoading}
                                                        type="button"
                                                        className='p-2 text-sm rounded-lg bg-primary text-white disabled:opacity-60 disabled:cursor-not-allowed'
                                                        onClick={handleUpdateCategory}
                                                    >Update</button>
                                                </div>}
                                        </div>
                                    )}
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default dynamic(() => Promise.resolve(ManageCategories), { ssr: false })


