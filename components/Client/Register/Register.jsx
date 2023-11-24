"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { userActions } from '@/store/reducers/userReducer';
import Link from 'next/link';
import { signUp } from '@/services/users';

export default function Register() {
    const userState = useSelector(state=>state.user);
    const router = useRouter();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(()=>{
        if(userState.userInfo){
            router.push('/');
        }
    }, [router, userState.userInfo]);
   
    const {register, handleSubmit, formState:{errors, isValid},watch,} = useForm({
        defaultValues:{
            name:"",
            email:"",
            password:"",
            confirmPassword:"",
        },
        mode:'onChange',
    });

    async function submitHandler(data) {
        setIsLoading(true);
        const {name,email,password} = data;
        const user = await signUp(name,email,password);
        if(!user?.success){
            toast.error(user?.message);
        }else{
            dispatch(userActions.setUserInfo(user?.data));
            localStorage.setItem('account',JSON.stringify(user?.data));
            console.log(user);
            toast.success('Signed Up Successfully.');
        }
        setIsLoading(false);
    }

    const password = watch('password');

    return (
        <section className='flex justify-center items-center'>
            <div className='py-10'>
                <h1 className='text-2xl md:text-3xl text-dark-hard text-center font-bold'>Sign Up</h1>
                <form
                    className='py-6 flex flex-col gap-4'
                    onSubmit={handleSubmit(submitHandler)}>
                    <div className=''>
                        <label className='block text-[#595959] font-semibold mb-1' htmlFor="name">Name</label>
                        <input 
                        {...register("name",{
                            minLength:{
                                value:2,
                                message:"Name must be at least 2 characters long."
                            },
                            required:{
                                value:true,
                                message:"Name is required."
                            }
                        })}
                        className='p-4 outline-none border border-dark-light rounded-md w-64 sm:w-80 md:w-96' 
                        name='name' 
                        type="address" 
                        placeholder='Enter Name' />
                        {errors.name?.message && <p className='mt-1 text-xs text-red-500'>{errors.name?.message}</p>}
                    </div>
                    <div className=''>
                        <label className='block text-[#595959] font-semibold mb-1' htmlFor="email">Email</label>
                        
                        <input 
                        {...register('email',{
                            pattern:{
                                value:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message:"Enter a valid email."
                            },
                            required:{
                                value:true,
                                message:"Email is required."
                            }
                        })}
                        className='p-4 outline-none border border-dark-light rounded-md w-64 sm:w-80 md:w-96' name='email' type="email" placeholder='Enter Email' />
                        {errors.email?.message && <p className='mt-1 text-xs text-red-500'>{errors.email?.message}</p>}
                    </div>
                    <div className=''>
                        <label className='block text-[#595959] font-semibold mb-1' htmlFor="password">Password</label>
                        <input 
                        {...register("password",{
                            minLength:{
                                value:6,
                                message:"Password must be at least 6 characters long."
                            },
                            required:{
                                value:true,
                                message:"Password is required."
                            }
                        })}
                        className='p-4 outline-none border border-dark-light rounded-md w-64 sm:w-80 md:w-96' name='password' type="password" placeholder='Enter Password' />
                        {errors.password?.message && <p className='mt-1 text-xs text-red-500'>{errors.password?.message}</p>}
                    </div>
                    <div className=''>
                        <label className='block text-[#595959] font-semibold mb-1' htmlFor="confirmPassword">Confirm Password</label>
                        
                        <input 
                        {...register("confirmPassword",{
                            required:{
                                value:true,
                                message:"Confirm Password is required."
                            },
                            validate:(value)=>{
                                if(value!==password){
                                    return "Password does not match.";
                                }
                            }
                        })}
                        className='p-4 outline-none border border-dark-light rounded-md w-64 sm:w-80 md:w-96' name='confirmPassword' type="password" placeholder='Confirm Password' />
                        {errors.confirmPassword?.message && (<p className='mt-1 text-xs text-red-500'>{errors.confirmPassword?.message}</p>)}
                    </div>

                    <button 
                    disabled={!isValid || isLoading} 
                    className='bg-primary rounded-lg py-4 text-lg text-white hover:bg-opacity-95 disabled:opacity-70 disabled:cursor-not-allowed' type="submit">Register</button>

                    <div className='flex flex-row gap-3'>
                        <a className='text-[#595959] font-semibold text-xs'>Already have an account?</a>
                        <Link href={'/login'} className='text-primary font-semibold text-xs'>Login Now</Link>
                    </div>
                </form>

            </div>
        </section>
    )
}
