"use client";
import React, { useEffect, useState } from 'react';
import { Blocks, Grid2X2, MessageCircle, User2, Users2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
// import ProfileComments from './ProfileComments';
import ProfileSettings from './ProfileSettings';
import ProfileBlogs from './ProfileBlogs';
import dynamic from 'next/dynamic';
import ManageUsers from './ManageUsers';
import ManageCategories from '../Categories/ManageCategories';

function Profile() {
    const router = useRouter();
    const userState = useSelector(state=>state.user);
    useEffect(
        ()=>{
            if(!userState?.userInfo){
                router.push('/login');
            }
        }, [router, userState?.userInfo]
    )

    const [isProfile, setIsProfile] = useState(true);
    const [isBlogs, setIsBlogs] = useState(false);
    const [isComments, setIsComments] = useState(false);
    const [isUsers, setIsUsers] = useState(false);
    const [isCategories, setIsCategories] = useState(false);

    function sideviewHandler(type = '') {
        if (type === 'blogs') {
            setIsProfile(() => false)
            setIsBlogs(() => true)
            setIsComments(() => false)
            setIsUsers(() => false);
            setIsCategories(false);
        } else if (type === 'comments') {
            setIsProfile(() => false)
            setIsBlogs(() => false)
            setIsComments(() => true)
            setIsUsers(() => false);
            setIsCategories(false);
        }  else if (type === 'categories') {
            setIsProfile(() => false)
            setIsBlogs(() => false)
            setIsComments(() => false)
            setIsUsers(() => false);
            setIsCategories(true);
        } 
        else if (type === 'users') {
            setIsCategories(false);
            setIsProfile(() => false)
            setIsBlogs(() => false)
            setIsComments(() => false)
            setIsUsers(() => true);
        } else {
            setIsProfile(() => true)
            setIsBlogs(() => false)
            setIsComments(() => false)
            setIsUsers(() => false);
            setIsCategories(false);
        }
    }

    return (
        <div className='grid md:flex'>
            <aside className='md:block w-full md:w-[25%] bg-white border border-t-2 '>
                <h1 className='hidden md:block my-4 font-bold text-center text-dark-hard'>Main Menu</h1>
                <div className='my-3 md:my-8 px-2 md:px-8 flex flex-row md:flex-col justify-start flex-wrap gap-10 gap-y-4 md:gap-10 text-md font-bold w-screen text-dark-light'>
                    <button
                        onClick={() => {
                            sideviewHandler()
                        }}
                        className={`${isProfile?"text-primary ":" "} w-fit md:w-full flex gap-1 md:gap-8 items-center hover:text-primary `}>
                        <User2 />
                        <p>Profile</p>
                    </button>
                    {(userState?.userInfo?.admin || userState?.userInfo?.author) &&
                     <button
                        onClick={() => {
                            sideviewHandler('blogs')
                        }}
                        className={`${isBlogs?"text-primary ":" "} w-fit md:w-full flex gap-1 md:gap-8 items-center hover:text-primary `}>
                        <Blocks />
                        <p>Blogs</p>
                    </button>}
                    {userState?.userInfo?.admin &&
                    <button
                        onClick={() => {
                            sideviewHandler('categories')
                        }}
                        className={`${isCategories?"text-primary ":" "} w-fit md:w-full flex gap-1 md:gap-8 items-center hover:text-primary `}>
                        <Grid2X2 />
                        <p>Categories</p>
                    </button>}
                    {userState?.userInfo?.admin &&
                    <button
                        onClick={() => {
                            sideviewHandler('users')
                        }}
                        className={`${isUsers?"text-primary ":" "} w-fit md:w-full flex gap-1 md:gap-8 items-center hover:text-primary `}>
                        <Users2 size={28} />
                        <p>Manage Users</p>
                    </button>}
                    {userState?.userInfo?.admin &&
                    <button
                        onClick={() => {
                            sideviewHandler('comments')
                        }}
                        className={`${isComments?"text-primary ":" "} w-fit md:w-full flex gap-1 md:gap-8 items-center hover:text-primary `}>
                        <MessageCircle />
                        <p>Comments</p>
                    </button>}
                </div>
            </aside>

            { userState?.userInfo &&
                <div className='w-[100%] md:w-[75%] g-[#f8f8f8] border'>
                {isProfile &&
                <ProfileSettings />}
                {isBlogs &&
                <ProfileBlogs />}
                {isUsers &&
                <ManageUsers />
                }
                {isComments &&
                // <ProfileComments />
                <div>Profile Comments</div>}
                {isCategories &&
                <ManageCategories />
            }
            </div> }
        </div>
    )
}

export default dynamic (() => Promise.resolve(Profile), {ssr: false})

