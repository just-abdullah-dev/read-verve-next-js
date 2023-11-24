import React from 'react';
import { images } from '@/constants';
import Image from 'next/image';
import SearchBox from '@/components/Client/HeroSection/SearchBox';

export default function HeroSection() {

    return (
        <section className='mx-10 my-4 md:mx-14 md:my-4 flex items-center'>
            {/* text div  */}
            <div className='flex flex-col gap-8 lg:w-[50%]'>
                <div className='md:text-center lg:text-left'>
                    <h1 className='text-4xl font-bold text-dark-hard'>Read the most interesting articles</h1>
                    <p className='text-dark-light text-lg '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt magni ipsa obcaecati maxime praesentium dolores reprehenderit enim.</p>
                </div>

                <SearchBox />
            </div>

            {/* Image div */}
            <div className='hidden lg:flex lg:w-[50%] relative justify-end items-center'>
                <Image
                    width={450}
                    height={57}
                    src={images.heroimage}
                    alt="Hero Image" />
            </div>
        </section>
    )
}
