"use client";
import React, { useState } from 'react';
import CommentIndividual from './CommentIndividual';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { deleteComment } from '@/services/comments';
import { updateRevalidate } from '@/services/revalidate';
import { useRouter } from 'next/navigation';

function 
AllComments({ 
  comments,
  slug
}) {
  const router = useRouter();
  const userState = useSelector(state => state.user);
  const [isDeleting, setIsDeleting] = useState(false);

  const mutateDeleteComment = async({token, _id})=>{
    setIsDeleting(true);
    const data = await deleteComment(token, _id);
    await updateRevalidate();
    router.refresh();
    toast.success('Comment has been deleted.');
    setIsDeleting(false);
  }

  // const {mutate: mutateDeleteCommen, isLoading: isLoadingDeleting} = useMutation({
  //   mutationFn: ({token, _id}) => {
  //     return deleteComment(token, _id);
  //   },
  //   onSuccess: ()=>{
  //     updateRevalidate();
  //     router.refresh();
  //     toast.success('Comment has been deleted.');
  //   },
  //   onError: (error)=>{
  //     toast.error(error.message);
  //   }
  // })
  
  function handleDelete(_id){
    if (window.confirm('Are sure to delete comment?')) {
      mutateDeleteComment({
        token: userState.userInfo.token,
        _id
      })
    }
  }
  return (
    <div className='grid gap-4'>
      <h1 className='text-xl font-bold'>All Comments({comments.length})</h1>
      <div className={`grid gap-6`}>
        {
          comments.map((comment) => {
            return (
              <CommentIndividual
              slug={slug}
              key={comment._id} 
              comment={comment}
              handleDelete={handleDelete}
              isDeleting={isDeleting} />
            )
          })
        }
      </div>
    </div>
  )
}

export default dynamic (() => Promise.resolve(AllComments), {ssr: false})
