"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/actions/user';
import Link from 'next/link';
import { images } from '@/constants';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';

function Header() {

  const [isOpen, setIsOpen] = useState(false);
  const userState = useSelector(state => state.user);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(logout());
        router.push('/login');
    }
    const toggleNavbar = () => {
        setIsOpen((prevState) => !prevState)
    }
    const navlinks = [
        { path: '/', label: 'Home' },
        { path: '/blogs', label: 'Blogs' },
        { path: '/categories', label: 'Categories' },
        { path: '/about', label: 'About' },
    ];
    const router = useRouter();
    return (
        <header className={`${isOpen ? 'flex-col' : 'flex-row'} pl-8 pr-8 py-3 flex justify-between items-center h-fit w-full sticky top-0 left-0 right-0 z-20 bg-white shadow-sm`}>
            <div className={`${isOpen ? 'self-start' : ''} m-0 p-0 flex justify-between items-center w-[100%] md:w-auto`}>
                <Link href="/" className=''>
                    <Image
                        width={56}
                        height={16}
                        src={images.logo}
                        alt="Logo image" />
                </Link>
                <div className={`md:hidden`}>
                    {isOpen ?
                        <X onClick={toggleNavbar} /> :
                        <Menu onClick={toggleNavbar} />}
                </div>
            </div>
            <div className={``}>
                <ul className={`${isOpen ? 'block' : 'hidden'} gap-8 items-center flex flex-col md:flex md:flex-row`}>
                    {
                        navlinks.map((item, index) => (
                            <li key={index}
                                className='text-md relative group font-bold'>
                                <Link
                                    onClick={isOpen ? toggleNavbar : null}
                                    className='mx-4'
                                    href={item.path}
                                    >{item.label}</Link>
                                <span className='text-md transition-all duration-500 absolute right-0 group-hover:opacity-100 group-hover:right-[95%] opacity-0'>/</span>
                            </li>
                        ))
                    }
                    {userState?.userInfo ?
                        <div className='relative'>
                            <button
                                className='text-primary flex text-md items-center gap-1 font-bold'
                                onClick={() => setProfileDropdown(!profileDropdown)}>
                                <div className='flex items-center justify-between gap-2'>
                                    {userState?.userInfo?.avatar && <Image width={44} height={44} className='rounded-full' src={userState?.userInfo?.avatar} alt="DP" />}
                                    <p>{userState?.userInfo?.name.split(" ")[0]}</p>
                                </div>
                                {profileDropdown ?
                                    <ChevronUp /> :
                                    <ChevronDown /> 
                                }

                            </button>
                            {profileDropdown ?
                                <div className='absolute top-8 right-2 rounded-2xl bg-white text-md font-bold w-28 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]'>
                                    <button
                                        onClick={() => {
                                            setProfileDropdown(!profileDropdown);
                                            isOpen ? toggleNavbar() : null;
                                            router.push('/dashboard');
                                        }}
                                        className='px-3 py-2 rounded-t-2xl w-full hover:bg-black hover:text-white'>
                                        Dashboard
                                    </button>
                                    <button
                                        className='px-3 py-2 rounded-b-2xl w-full hover:bg-black hover:text-white'
                                        onClick={()=>{
                                            logoutHandler();
                                            isOpen ? toggleNavbar() : null;
                                        }}>
                                        Log Out
                                    </button>
                                </div> : <></>}
                        </div> :
                        <li>
                            <Link
                                onClick={isOpen ? toggleNavbar : null}
                                className={`md:ml-3 m-0 border border-primary text-primary py-2 px-7 md:px-6 rounded-3xl hover:bg-primary hover:text-white ring-offset-2 active:ring-2 ring-primary transition-all font-bold`}
                                href={'/register'}
                            >Sign in
                            </Link>
                        </li>}

                </ul>
            </div>
        </header>
    )
}

export default dynamic (() => Promise.resolve(Header), {ssr: false})
