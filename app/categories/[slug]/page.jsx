import React from 'react';

export const metadata = {
  title: 'Read Verve Categories',
  description: 'This is my first website in nextjs. In Shaa Allah, I will complete this whole project.',
}

export default function page({params}) {
  return (
    <div>{params.slug}
       Categories Page</div>
  )
}
