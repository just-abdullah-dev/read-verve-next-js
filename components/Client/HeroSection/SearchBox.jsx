"use client";
import React, { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchBox() {
    const [isFirstRun, setIsFirstRun] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const router = useRouter();
    const popularTags = [
        'Design',
        'Web 3.0',
        'User Interface',
        'Web Development',
        'Artificial Intelligence',
    ]
    async function searchArticle(tag) {
        setSearchInput(() => tag);
    }
    function toggleSearchText(event) {
        setSearchInput(() => event.target.value);
    }
    function handleSearchBtn() {
        addQueryToLink();
    }
    function addQueryToLink(){
        router.push(`?q=${searchInput}&p=1&l=9`);
    }
    useEffect(
        ()=>{
            if(isFirstRun){
                setIsFirstRun(false);
            }
            if(searchInput === '' && !isFirstRun){
                addQueryToLink();
            }

        }, [searchInput, setSearchInput, router, isFirstRun]
    )

    return (
        <div className='flex flex-col gap-4 relative'>
            <input
                className='rounded-lg w-full py-2 px-4 text-lg outline-none border-b-2'
                type="text" name="search" id="search" placeholder='Search article' value={searchInput} onChange={toggleSearchText} />
            <button
                className='flex gap-3 justify-center rounded-lg w-full bg-primary text-white py-2 text-lg hover:opacity-95  md:absolute md:right-0 md:w-fit md:px-4 md:scale-75 md:text-xl'
                type="button"
                onClick={handleSearchBtn}><SearchIcon /> Search</button>
            <div className='md:flex md:flex-wrap md:items-center md:gap-2'>
                <p className='font-bold'>Popular Tags: </p>
                {
                    popularTags.map((tag, index) => (
                        <button
                            key={index}
                            onClick={() => searchArticle(tag)}
                            className='font-bold text-primary px-4 py-2 bg-secondary rounded-lg m-1 hover:bg-primary hover:text-white'>
                            {tag}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}
