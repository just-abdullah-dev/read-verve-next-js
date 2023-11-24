"use client";
import React, { useState } from 'react'
import { Reply, Pencil, Trash, User2 } from 'lucide-react'
import CommentInput from './CommentInput';
import { useSelector } from 'react-redux';
import Image from 'next/image';
export default function CommentIndividual({ comment, handleDelete, name = "comment", isDeleting, slug }) {
  const userState = useSelector(state => state.user);
  const replies = comment?.replies || [];
  const [replyBtn, setReplyBtn] = useState(false)
  const [editBtn, setEditBtn] = useState(false)
  const isCommentBelongToUser = (userState?.userInfo?._id === comment?.user?._id);

  return (
    <div>
      <div className='flex gap-3 p-4 bg-gray-100 rounded-xl'>
        {comment?.user?.avatar ?
          <div className=''>
            <Image
              className='rounded-full'
              width={40}
              height={40}
              src={comment?.user?.avatar}
              alt="User Profile Picture" />
          </div>
          :
          <div 
          className='border-2 rounded-full w-9 h-9 flex justify-center items-center border-black'
          >
            <User2 size={30} strokeWidth={1} /></div>
        }

        <div>
          <div className='grid gap-4'>
            <div>
              <h1 className='text-md font-bold'>{comment?.user?.name}</h1>
              <p className='text-sm text-dark-light'>
                {new Date(comment?.createdAt).getDate()}{"-"}
                {new Date(comment?.createdAt).toLocaleString("default", { month: "short" })}{"-"}
                {new Date(comment?.createdAt).getFullYear() % 100}{" "}
                {new Date(comment?.createdAt).getHours()}{":"}
                {new Date(comment?.createdAt).getMinutes()}

              </p>
            </div>
            <div className='px-2'>{comment?.desc}</div>

            <div className='flex flex-wrap gap-3'>
              {userState?.userInfo && <button
                onClick={() => { setReplyBtn((value) => !value); setEditBtn(false); }}
                className='flex gap-1 text-sm hover:text-dark-light'>
                <Reply className='h-4' />Reply</button>}

              {isCommentBelongToUser &&
                <>
                  <button
                    onClick={() => { setReplyBtn(false); setEditBtn((value) => !value); }}
                    className='flex gap-1 text-sm hover:text-dark-light'><Pencil className='h-4' />Edit</button>
                  <button
                    disabled={isDeleting}
                    onClick={() => handleDelete(comment._id)}
                    className='flex gap-1 text-sm hover:text-dark-light disabled:opacity-60 disabled:cursor-not-allowed'><Trash className='h-4' />Delete</button>
                </>}
            </div>
            {replyBtn &&
              <CommentInput
                slug={slug}
                className='sm:w-60 md:w-96'
                typeOfComment={'reply'}
                commentLabel={'Leave your reply here...'}
                buttonLabel={'Reply'}
                parent={name === 'comment' ? comment?._id : comment?.parent}
                replyOnUser={comment?.user?._id}
                closeInput={() => { setReplyBtn(false) }} />
            }
            {editBtn &&
              <CommentInput
                slug={slug}
                className='sm:w-60 md:w-96'
                typeOfComment={'edit'}
                valueOfForm={comment?.desc}
                buttonLabel={'Update'}
                closeInput={() => { setEditBtn(false) }}
                commentID={comment?._id} />}
          </div>
          {replies.length > 0 &&
            <div className='mt-6'>
              {replies.map((reply) => {
                return (
                  <CommentIndividual
                    slug={slug}
                    name={'reply'}
                    key={reply._id}
                    comment={reply} />
                )
              })}
            </div>}
        </div>
      </div>
    </div>
  )
}
