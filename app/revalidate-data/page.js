import stables from '@/constants/stables';
import { updateRevalidate } from '@/services/revalidate';
import { revalidatePath } from 'next/cache';
import React from 'react';

export default function page() {
  (async () => {
    const url = `${stables.BASE_URL}/api/revalidate/get`;
    const res = await fetch(url, {cache: 'no-cache'});
    const data = await res.json();
    if (data?.data?.revalidate) {
      revalidatePath('/', 'page');
      revalidatePath('/blogs', 'page');
      revalidatePath('/blogs/[slug]', 'page');
      revalidatePath('/categories', 'page');
      revalidatePath('/categories/[slug]', 'page');
      await updateRevalidate(false);
    }
  })();

  return (
    <div>Data has been Revalidated.</div>
  )
}
