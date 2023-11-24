import React from 'react';

export default function HeroSkeleton({showImageSkeleton}) {
    return (
        <div className='flex'>
        <div className={`${!showImageSkeleton ? 'w-full h-80 px-52 my-20':'w-1/2 h-fit p-16'} bg-white rounded-2xl overflow-hidden flex flex-col gap-4 animate-pulse`}>
            {/* image div  */}
            <div className='w-full aspect-video bg-slate-200 p-12 rounded-xl' >
                <div className='h-8 w-full bg-slate-300 rounded-2xl' />
                <div className='h-12 w-full bg-slate-300 rounded-2xl my-14' />
                <div className='flex gap-10'>
                    <div className='h-6 w-full bg-slate-300 rounded-2xl' />
                    <div className='h-6 w-full bg-slate-300 rounded-2xl' />
                    <div className='h-6 w-full bg-slate-300 rounded-2xl' />
                    <div className='h-6 w-full bg-slate-300 rounded-2xl' />

                </div>
            </div>

        </div>
        {showImageSkeleton && 
        <div className='w-1/2 h-fit bg-white rounded-2xl overflow-hidden flex flex-col animate-pulse p-16'>
        {/* image div  */}
        <div className='w-full aspect-video bg-slate-300 rounded-xl' />
    </div>}
        </div>
    )
}
