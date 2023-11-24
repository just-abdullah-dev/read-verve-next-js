"use client";
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';


export default function EmailInbox() {
    const [inboxEmail, setInboxText] = useState('');
    const toggleInboxEmail = (event) => {
        setInboxText(() => event.target.value)
    }
    const handleSubmit = ()=>{
        toast.success('We are working on this feature.');
    }
    return (
        <div className='grid gap-4 md:flex md:justify-center'>
            <input
                className='text-black rounded-lg w-full py-2 px-4 text-lg outline-none border-b-2 md:w-1/2'
                type="email" name="email" id="email" placeholder='Your Email' value={inboxEmail} onChange={toggleInboxEmail} />
            <button
                onClick={handleSubmit}
                className='flex gap-3 justify-center rounded-lg w-full bg-primary text-white py-2 text-lg hover:opacity-95 md:w-1/3'
                type="button">Get Started <Mail /></button>
        </div>
    )
}
