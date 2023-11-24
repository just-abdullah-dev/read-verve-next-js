import React from 'react';
import ArticleCard from './ArticleCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Pagination from './Pagination';
import stables from '@/constants/stables';

export default async function PostsDisplay({ keyword = '', page = 1, limit = 9, showMoreBtn = false }) {
    const url = `${stables.BASE_URL}/api/posts/getAllPosts?searchKeyword=${keyword}&page=${page}&limit=${limit}`;
    const options = {
        method: 'GET',
    };

    const res = await fetch(url, options);
    const posts = await res.json();
    const headers = res.headers;
    const totalPageCount = headers.get('x-totalpagecount');
    
    return (
        <div className='grid my-14'>
      {!posts.success
      ?
        <div className='w-full h-96 flex justify-center items-center'>
          <p className='text-red-600 font-bold text-xl'>{posts.message}</p>
        </div> :
        <><div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-14 mb-10'>
          {posts.success && posts?.data.map((post) => {
              if(post.publish){
                return <ArticleCard key={post._id} post={post} />;
              }
              })
            }
        </div>
          {showMoreBtn ?
            <div className='flex justify-center mt-14'>
              <Link className='text-primary font-bold flex gap-2 border-2 border-primary w-fit px-3 py-2 rounded-lg' href='/blogs'>More articles<ArrowRight /></Link>
            </div>:
            // posts?.data.length >= 2 &&
            <Pagination
              totalPageCount={totalPageCount ? totalPageCount : 10}
            />}
        </>
      }

    </div>
    )
}
/*
"use client";
import React from 'react';
import { Component } from 'react';

class PostsDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoading: true,
      message: 'Loading...'
    };
  }

  componentDidMount() {
    const url = `http://localhost:3000/api/posts/getAllPosts?searchKeyword=${this.props.keyword}&page=${this.props.page}&limit=${this.props.limit}`;

    const options = {
      method: 'GET'
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((posts) => {
        this.setState({ posts, isLoading: false });
        if (!posts.success) {
          this.setState({ message: posts.message });
        } else {
          this.setState({ message: "Posts Displayed Successfully" });
        }
      });
  }

  render() {
    const { posts, isLoading, message } = this.state;

    return (
      <div>
        <h1>Posts Display</h1>
        <hr />
        <p>{message}</p>
        {isLoading ? (
        //   <SkeletonComponent />
        <div>Loading... hehehe</div>
        ) : (
          posts.success &&
          <p>{posts.data[0].title}</p>
        )}
      </div>
    );
  }
}

export default PostsDisplay;
*/
