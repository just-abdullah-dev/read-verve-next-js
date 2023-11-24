
import PostsDisplay from "@/components/Server/Article/PostsDisplay";
import HeroSection from "@/components/Server/HeroSection/HeroSection";
import Inbox from "@/components/Server/Inbox/Inbox";

export default async function Home({ searchParams }) {
  const query = searchParams?.q || '';
  const page = parseInt(searchParams?.p) || 1;
  const limit = parseInt(searchParams?.l) || 9;


  return (
    <div>
      <HeroSection />
      <PostsDisplay showMoreBtn={true} keyword={query} page={page} limit={limit} />
      <Inbox />
    </div>
  )
}
