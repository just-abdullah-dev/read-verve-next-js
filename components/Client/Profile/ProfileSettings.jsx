"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import ChangePassword from './ChangePassword';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { userActions } from '@/store/reducers/userReducer';
import { getUserProfile, updateUserProfile } from '@/services/users';
import dynamic from 'next/dynamic';

function ProfileSettings() {
  const [isChangePassword, setIsChangePassword] = useState(false)
  const router = useRouter();
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState({
    value: '',
    error: ''
  });
  const [name, setName] = useState({
    value: '',
    error: ''
  });
  const [email, setEmail] = useState({
    value: '',
    error: ''
  });
  const [isValidData, setIsValidData] = useState(false);

  const handleChangeName = (e) => {
    const NAME = e.target.value;
    if (NAME.length >= 2) {
      setName(() => {
        return { error: '', value: NAME };
      })
      if (!isValidData && !avatar.error && !email.error) {
        setIsValidData(true)
      }
    } else {
      setName(() => {
        return { value: NAME, error: 'Name must be at least 2 characters long.' };
      })
      if (isValidData) {
        setIsValidData(false)
      }
    }
  }
  const handleChangeAvatar = (e) => {
    const AVATAR = e.target.value;
    const pattern = /^(http)(s)?:\/\/.*\.(jpeg|jpg|png)$/i;
    if (pattern.test(AVATAR)) {
      setAvatar(() => {
        return { value: AVATAR, error: "" }
      })
      if (!isValidData && !email.error && !name.error) {
        setIsValidData(true)
      }
    } else {
      setAvatar(() => {
        return { value: AVATAR, error: "E.g: https://i.ibb.co/r3kHyV2/profile.jpg OR .jpeg OR .png" }
      })
      if (isValidData) {
        setIsValidData(false)
      }
    }
  }

  const handleChangeEmail = (e) => {
    const EMAIL = e.target.value;
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (pattern.test(EMAIL)) {
      setEmail(() => {
        return { value: EMAIL, error: "" }
      })
      if (!isValidData && !avatar.error && !name.error) {
        setIsValidData(true)
      }
    } else {
      setEmail(() => {
        return { value: EMAIL, error: "Enter a valid email." }
      })
      if (isValidData) {
        setIsValidData(false)
      }
    }
  }

  useEffect(() => {
    if (!userState.userInfo) {
      router.push('/');
    }
    (async () => {
      try {
        const data = await getUserProfile(userState?.userInfo?.token);
        if (!data?.success) {
          toast.error(data?.message);
          return;
        }
        setAvatar(() => {
          return {
            value: data?.avatar,
            error: ''
          }
        })
        setName(() => {
          return {
            value: data?.name,
            error: ''
          }
        })
        setEmail(() => {
          return {
            value: data?.email,
            error: ''
          }
        })
        setIsValidData(true)
      } catch (error) {
        toast.error(error.message);
      }
    })();
  }, [router, userState.userInfo]);


  function toggleChangePassword() {
    setIsChangePassword(val => !val);
  }

  async function submitHandler() {
    setIsValidData(false);
    try {
      const data = await updateUserProfile(userState.userInfo.token, { name: name.value, email: email.value, avatar: avatar.value });
      console.log(data);
      dispatch(userActions.setUserInfo(data));
      localStorage.setItem('account', JSON.stringify(data));
      toast.success('Profile has been updated.');
      setIsValidData(true);
    } catch (error) {
      toast.error(error.message)
    }
  }


  return (
    <div className='flex flex-col items-center gap-8 my-8'>
      <h1 className='font-bold text-3xl tracking-wide'>Profile Settings</h1>
      <div className=''>
        {/* <ProfilePicture avatar={userState.userInfo.avatar} /> */}
        <div
          className='py-6 flex flex-col gap-4 '>
          <div className=''>
            <label className='block text-[#595959] font-semibold mb-1' htmlFor="name">DP Image URL</label>
            <input
              className='p-4 outline-none border border-dark-light rounded-md w-64 sm:w-80 md:w-96'
              name='avatar'
              type="address"
              value={avatar.value}
              onChange={(e) => handleChangeAvatar(e)}
              placeholder='Enter DP Image URL' />
            {avatar.error && <p className='mt-1 text-xs text-red-500'>{avatar.error}</p>}
          </div>
          <div className=''>
            <label className='block text-[#595959] font-semibold mb-1' htmlFor="name">Name</label>
            <input
              className='p-4 outline-none border border-dark-light rounded-md w-64 sm:w-80 md:w-96'
              name='name'
              type="address"
              value={name.value}
              onChange={(e) => handleChangeName(e)}
              placeholder='Enter Name' />
            {name.error && <p className='mt-1 text-xs text-red-500'>{name.error}</p>}
          </div>
          <div className=''>
            <label className='block text-[#595959] font-semibold mb-1' htmlFor="email">Email</label>

            <input
              className='p-4 outline-none border border-dark-light rounded-md w-64 sm:w-80 md:w-96'
              name='email'
              value={email.value}
              onChange={(e) => handleChangeEmail(e)}
              type="email" placeholder='Enter Email' />
            {email.error && <p className='mt-1 text-xs text-red-500'>{email.error}</p>}
          </div>

          <button
            disabled={!isValidData}
            onClick={submitHandler}
            className='bg-primary rounded-lg py-4 text-lg text-white hover:bg-opacity-95 disabled:opacity-70 disabled:cursor-not-allowed' type="submit">Update</button>
        </div>
        <hr className='border-b-1 border-black w-full mb-6' />
        <div>
          {!isChangePassword ?
            <button
              className='py-4 rounded-lg text-lg bg-white text-primary w-full font-bold outline outline-1 outline-primary hover:bg-opacity-95 '
              type="button"
              onClick={toggleChangePassword}>Change Password</button> :
            <ChangePassword toggleView={toggleChangePassword} />}
        </div>
      </div>

    </div>
  )
}

export default dynamic (() => Promise.resolve(ProfileSettings), {ssr: false})
