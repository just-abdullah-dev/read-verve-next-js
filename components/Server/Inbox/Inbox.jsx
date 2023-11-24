import EmailInbox from '@/components/Client/Inbox/EmailInbox';
import { images } from '@/constants';
import Image from 'next/image';
import React from 'react';

export default function Inbox() {
    
    return (
        <div className='bg-dark-hard outline-none border-none'>
        <div className='h-12 bg-white rounded-b-[50%] lg:h-20 lg:rounded-b-[80%]'></div>

        <div className='md:flex md:flex-col-reverse lg:flex-row lg:justify-center lg:items-center'>
            {/* inbox div  */}
            <div className='px-10 py-10 md:px-14 md:py-14 flex flex-col gap-4 text-white'>
                <h1 className='text-xl font-bold tracking-wide md:text-center'>Get our stories delivered From us to your inbox weekly.</h1>
                <EmailInbox />
                <p className='text-dark-light md:text-center lg:text-[#f7f7f7]'><span className='text-white'>Get a response tomorrow</span> if you submit by 9pm today. If we received after 9pm will get a reponse the following day.</p>
            </div>

            {/* Image div  */}
            <div className='hidden md:flex justify-center items-center md:px-14 md:pt-14 lg:py-14'>
                <Image width={500} height={500} className='' src={images.inbox} alt="" />
            </div>
        </div>
        </div>
    )
}
