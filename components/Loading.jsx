import { Loader2Icon } from 'lucide-react'
import React from 'react'
// import 
export default function Loading() {
  return (
    <div className='flex justify-center items-center w-full h-screen'>
        <Loader2Icon size={48} className='animate-spin' />
    </div>
  )
}
