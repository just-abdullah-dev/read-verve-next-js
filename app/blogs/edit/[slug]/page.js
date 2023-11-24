
import TinyEditor from '@/components/Client/Editor/TinyEditor';
import React from 'react';

export const metadata = {
  title: 'Blog Editor - Content Manager',
  description: 'This is my first website in nextjs. In Shaa Allah, I will complete this whole project.',
}

export default async function page({params}) {
  return (
    <TinyEditor slug={params.slug} />
  )
}

