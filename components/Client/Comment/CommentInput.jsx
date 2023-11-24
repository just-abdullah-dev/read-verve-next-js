"use client";
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createComment, updateComment } from '@/services/comments';
import { updateRevalidate } from '@/services/revalidate';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';

export default function CommentInput({
  commentLabel,
  buttonLabel,
  typeOfComment,
  parent = null,
  replyOnUser = null,
  valueOfForm = '',
  closeInput = null,
  commentID = '',
  className = '',
  slug
}) {
  const [value, setValue] = useState(valueOfForm);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userState = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    ()=>{
      if(userState?.userInfo){
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
    }, [userState]
  )

  async function revalidateAndRefresh() {
    await updateRevalidate();
    router.refresh();
  }

  const mutateNewComment = async ({ token, slug, desc, parent, replyOnUser }) => {
    setIsLoading(true);
    const data = await createComment(token, slug, desc, parent, replyOnUser);
    if (!data?.success) {
      toast.error(data?.message)
    } else {
      await revalidateAndRefresh();
      toast.success("Your comment has been added.");
    }
    setIsLoading(false);
  }

  const mutateUpdateComment = async ({ token, _id, desc }) => {
    setIsLoading(true);
    const data = await updateComment(token, desc, _id);
    if (!data?.success) {
      toast.error(data?.message)
    } else {
      await revalidateAndRefresh();
      toast.success("Comment has been successfully updated.");
    }
    setIsLoading(false);
  }

  function handleClick() {
    if (value !== '' && value.length >= 3) {
      if (typeOfComment === 'new' || typeOfComment === 'reply') {
        mutateNewComment({
          token: userState.userInfo.token,
          slug: slug,
          desc: value,
          parent: parent,
          replyOnUser: replyOnUser
        });
        setValue('');
      } else if (typeOfComment === 'edit') {
        mutateUpdateComment({
          token: userState.userInfo.token,
          desc: value,
          _id: commentID
        })
        setValue('');
      }
    } else {
      window.alert('Comment cannot be leave empty. OR Length of comment should be atleast 3 letters.')
    }
    if (typeOfComment === 'reply' || typeOfComment === 'edit') {
      closeInput();
    }
  }

  return (
    <div className={`${className} relative`}>
      <textarea
        disabled={!isLoggedIn}
        className={`w-full max-h-36 h-36 border-2 border-primary outline-none p-3 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed`}
        placeholder={commentLabel}
        value={value}
        onChange={(event) => setValue(() => event.target.value)}
      ></textarea>

      <button
        disabled={isLoading || !isLoggedIn}
        onClick={handleClick}
        type="button"
        className={`text-white bg-primary rounded-md px-3 py-1 absolute right-4 bottom-5 disabled:opacity-60 disabled:cursor-not-allowed`}>
        {isLoading ?
          <Loader2Icon className='animate-spin' /> : buttonLabel}
      </button>
    </div>
  )
}
