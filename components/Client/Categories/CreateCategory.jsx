"use client";
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
import { createCategory } from '@/services/categories';
import { updateRevalidate } from '@/services/revalidate';

function CreateCategory() {
  const userState = useSelector((state) => state.user);
  const [category, setCategory] = useState({name:{value:'',error:''},slug:{value:'', error: ''}});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e){
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await createCategory(userState.userInfo.token, {name:category.name.value, slug: category.slug.value});
      if(!data?.success){
        toast.error(data?.message)
      }else{
        toast.success(data?.message);
        updateRevalidate();
      }
    } catch (error) {
      console.error(error);
      toast.error('Error Occured Check Console.');
    }
    setIsLoading(false);
  }

  function handleChange(e, type){
    const value = e.target.value;
    if(type === 'name'){
      if(!value){
        setCategory((prev)=>{
          return {...prev, name: {value: value, error: 'Name is required.'}}
        })
      }else{
        setCategory((prev)=>{
          return {...prev, name: {value: value, error: ''}}
        })
      }
    }else if(type === 'slug'){
      if(!value){
        setCategory((prev)=>{
          return {...prev, slug: {value: value, error: 'Slug is required.'}}
        })
      }else if(value.includes(' ')){
        setCategory((prev)=>{
          return {...prev, slug: {value: value, error: 'Slug should be free of any space.'}}
        })
      }else{
        setCategory((prev)=>{
          return {...prev, slug: {value: value, error: ''}}
        })
      }
    }
  }
  return (
    <div className="flex justify-center items-center">
      <form className="flex flex-col gap-2" onSubmit={(e)=>handleSubmit(e)}>
        <div className="">
          <label className="block text-[#595959] font-semibold mb-1" htmlFor="name">
            Name
          </label>
          <input
            className="p-2 outline-none border border-dark-light rounded-md w-64 sm:w-80 md:w-96"
            id="name"
            type="text"
            value={category.name.value}
            placeholder="Name of Category"
            onChange={(e)=>handleChange(e,'name')}
          />
          {category.name.error && <p className="mt-1 text-xs text-red-500">{category.name.error}</p>}
        </div>

        <div className="">
          <label className="block text-[#595959] font-semibold mb-1" htmlFor="slug">
            Slug
          </label>
          <input
            className="p-2 outline-none border border-dark-light rounded-md w-64 sm:w-80 md:w-96"
            id="slug"
            type="text"
            placeholder="Slug goes here..."
            onChange={(e)=>handleChange(e,'slug')}
            value={category.slug.value}
          />
          {category.slug.error && <p className="mt-1 text-xs text-red-500">{category.slug.error}</p>}
        </div>

        <button
          disabled={isLoading || category.name.error || category.slug.error || !category.name.value || !category.slug.value}
          className="mt-5 bg-primary rounded-lg py-2 text-lg text-white hover:bg-opacity-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          type="submit"
        >
          {isLoading ? <Loader className='animate-spin' />:'Create Category'}
        </button>
      </form>
    </div>
  );
}

export default dynamic (() => Promise.resolve(CreateCategory), {ssr: false})
