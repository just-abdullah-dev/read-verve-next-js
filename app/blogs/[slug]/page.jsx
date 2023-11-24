import Error from '@/components/Client/Error';
import ArticleView from '@/components/Server/Article/ArticleView';
import stables from '@/constants/stables';
import React from 'react';

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const post = await getData(slug);
  return {
    title: post.success ?  post?.data?.title : post.message,
    description: post.success ?  post?.data?.caption : post.message
  }
}

export const getData = async (slug) => {
  const post = await fetch(`${stables.BASE_URL}/api/posts/getPostDetail?slug=${slug}`).then((res) => res.json());
 return post;
}

export default async function page({ params }) {
  let postData = await getData(params.slug);
  return (
    <div>
      {(postData?.success && postData?.data?.publish) ? 
      <ArticleView post={postData?.data} slug={params.slug} />:
      postData?.message ? <Error message={postData?.message} />:<Error message={'Post is not published yet.'} />}
    </div>
  )
}
