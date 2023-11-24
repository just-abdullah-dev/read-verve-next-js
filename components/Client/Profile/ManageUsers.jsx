"use client";
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { PenBoxIcon, Trash2Icon, User2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Error from '../Error';
import { updateRevalidate } from '@/services/revalidate';
import { deleteUser, getAllUsers, updateUser } from '@/services/usersAdmin';
import Loading from '@/components/Loading';
import Image from 'next/image';


function ManageUsers() {
    const [searchUser, setSearchUser] = useState('');
    const userState = useSelector(state => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstRun, setIsFirstRun] = useState(true);
    const [users, setUsers] = useState(null);
    const [isError, setIsError] = useState('');
    const [isSelected, setIsSelected] = useState({
        id:'',
        admin:false,
        author: false,
        verified: false
    });

    async function handleDeleteUser(id) {
        if (window.confirm('Are you sure to delete user and its all posts and comments?')) {
            try {
                setIsLoading(false);
                const { token } = userState.userInfo;
                const data = await deleteUser(token, id);
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
                const data = await getAllUsers(userState.userInfo.token, searchUser);
                if (!data?.success) {
                    setIsError(data?.message);
                } else {
                    setIsError('');
                    setUsers(data?.data);
                }
                setIsFirstRun(false);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching users accounts: ", error);
            }
        };

        if (isFirstRun || !searchUser) {
            fetchData();
        }
    }, [userState, isFirstRun, searchUser]);

    async function handleUpdateUser(){
        try {
            setIsLoading(true);
            const data = await updateUser(userState.userInfo.token, 
                {   id:isSelected.id, 
                    admin: isSelected.admin ? 'yes':'no',
                    author: isSelected.author ? 'yes':'no',
                    verified: isSelected.verified ? 'yes':'no'
                });
                updateRevalidate();
            setIsFirstRun(true);
        } catch (error) {
            toast.error(error?.message)
        }
        setIsLoading(false);
    }
    return (
        <div className="my-8 mx-4">
            <div className="rounded-xl shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] p-4 pb-8">
                <div className="flex flex-col md:flex-row gap-y-5 justify-between items-center w-full p-4">
                    <h2 className="text-2xl font-semibold">
                        Manage Users
                    </h2>
                    <form onSubmit={(e) => { e.preventDefault(); setIsFirstRun(true); }} className="flex gap-6">
                        <input type="text" id="&quot;form-subscribe-Filter"
                            className="py-2 px-4 rounded-lg outline-none border border-gray-300"
                            placeholder="Search By Name"
                            value={searchUser}
                            onChange={(e) => { setSearchUser(e.target.value) }} />
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
                                    <div className='w-1/5 px-2 py-3 border-r-2 text-md font-semibold'><h2>Avatar</h2></div>
                                    <div className='w-1/5 px-2 py-3 border-r-2 text-md font-semibold'><h2>Name</h2></div>
                                    <div className='w-1/5 px-2 py-3 border-r-2 text-md font-semibold'><h2>Email</h2></div>
                                    <div className='w-1/5 px-2 py-3 border-r-2 text-md font-semibold'><h2>Role</h2></div>
                                    <div className='w-1/5 px-2 py-3 text-md font-semibold'><h2>Action</h2></div>
                                </div>
                                <div>
                                    {users && users.map((user, index) =>
                                        <div key={user._id} className=' border-b-2' >
                                            <div className={` flex gap-1 `}>
                                                <div className='w-1/5 px-2 py-3 text-md'>
                                                    {user?.avatar ?
                                                        <Image
                                                            width={44}
                                                            height={44}
                                                            className='aspect-square rounded-full'
                                                            src={user?.avatar}
                                                            alt="User Profile Picture" /> :
                                                        <div className='border-2 rounded-full w-11 h-11 flex justify-center items-center border-[#8d8d8d]'><User2 size={34} strokeWidth={1.5} color='#8d8d8d' /></div>
                                                    }
                                                </div>
                                                <div className='w-1/5 px-2 py-3 text-md flex items-center'>
                                                    <p>{user.name}</p>
                                                </div>
                                                <div className='w-1/5 px-2 py-3 text-md sm:flex items-center'>
                                                    <p>{user?.email}</p>
                                                </div>

                                                <div className='w-1/5 px-2 py-3 text-md flex items-center justify-center'>
                                                    {user?.admin &&
                                                        <p>Admin</p>}
                                                    {(user?.author && !user?.admin) &&
                                                        <p>Author</p>}
                                                    {(!user?.admin && !user?.author) &&
                                                        <p>Normal User</p>}

                                                </div>
                                                <div className='w-1/5 px-2 py-3 text-md flex items-center justify-center'>
                                                    <div className='flex gap-4'>
                                                        <button type="button" onClick={()=>setIsSelected(()=>{
                                                            return {id:user._id,admin:user.admin,author:user.author, verified:user.verified}
                                                        })}>
                                                            <PenBoxIcon
                                                                strokeWidth={2}
                                                                size={19} />
                                                        </button>
                                                           
                                                        <button
                                                            className='disabled:opacity-70 disabled:cursor-not-allowed'
                                                            disabled={isLoading}
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            type="button">
                                                            <Trash2Icon
                                                                strokeWidth={2}
                                                                size={19} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Update role of user */}
                                            {isSelected.id === user._id &&
                                            <div className='flex justify-around items-center py-2'>
                                            <div className='flex items-center gap-3 '>
                                                <label htmlFor="admin">Admin</label>
                                                <input type="checkbox" id="admin" checked={isSelected.admin} onChange={()=>{setIsSelected((prev)=>{
                                                return {...prev,admin: !isSelected.admin}
                                            })}} />
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <label htmlFor="author">Author</label>
                                                <input type="checkbox" id="author" checked={isSelected.author} onChange={()=>{setIsSelected((prev)=>{
                                                return {...prev,author: !isSelected.author}
                                            })}} />
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <label htmlFor="verified">Verified</label>
                                                <input type="checkbox" id="verified" checked={isSelected.verified} onChange={()=>{setIsSelected((prev)=>{
                                                return {...prev,verified: !isSelected.verified}
                                            })}} />
                                            </div>
                                            <button 
                                            type="button"
                                            className='px-2 py-1 text-sm rounded-lg bg-red-600 text-white'
                                            onClick={()=>setIsSelected(()=>{
                                                return {id:'',admin:false,author:false,verified:false}
                                            })}
                                            >Cancel</button>
                                            <button 
                                            disabled={isLoading}
                                            type="button"
                                            className='px-2 py-1 text-sm rounded-lg bg-primary text-white disabled:opacity-60 disabled:cursor-not-allowed'
                                            onClick={handleUpdateUser}
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

export default dynamic(() => Promise.resolve(ManageUsers), { ssr: false })


