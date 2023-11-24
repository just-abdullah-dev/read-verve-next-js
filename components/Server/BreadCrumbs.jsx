import Link from 'next/link';
import React from 'react';

export default function BreadCrumbs({data}) {

    return (
        <div className='flex pl-6 md:pl-8 pt-6 text-sm text-black'>
            {data.map((item,index)=>{
                return (
                    <div key={index}>
                        <Link href={item.link} className='opacity-50 hover:opacity-80'>{item.name}</Link>
                        {index !== data.length-1 && <span className='px-3 opacity-50'>/</span>}
                    </div>
                )
            })}
        </div>
    )
}
