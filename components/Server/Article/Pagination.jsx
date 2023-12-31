"use client";
import React from "react";
import { usePagination, DOTS } from "@/hooks/usePagination";
import { useRouter } from "next/navigation";

const Pagination = ({
  onParams = true,
  siblingCount = 1,
  totalPageCount,
  searchParams, 
  onPageChange = ()=>{},
  currentPage,
}) => {
  const query = searchParams?.q || '';
  const page = parseInt(searchParams?.p) || 1;
  const limit = parseInt(searchParams?.l) || 9;

  const router = useRouter();
  const paginationRange = usePagination({
    currentPage : page,
    siblingCount,
    totalPageCount,
  });

  if (page === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    if(onParams){
      router.push(`?q=${query}&p=${page + 1}&l=${limit}`);
    }else{
      onPageChange(currentPage + 1);
    }
  };
  const onPrevious = () => {
    if(onParams){
      router.push(`?q=${query}&p=${page - 1}&l=${limit}`);
    }else{
      onPageChange(currentPage - 1);
    }
  };
  const onPageChangeFunc = (pageNumber) => {
    if(onParams){
      router.push(`?q=${query}&p=${pageNumber}&l=${limit}`);
    }else{
      onPageChange(pageNumber);
    }
  }

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
      <div className="flex items-center">
        <button
          disabled={page === 1}
          type="button"
          className="w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onPrevious}
        >
          <svg
            width="9"
            fill="currentColor"
            height="8"
            className=""
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
          </svg>
        </button>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <button key={index} className="cursor-default w-full px-4 py-2 text-base bg-white border">
                &#8230;
              </button>
            );
          }

          return (
            <button
              key={pageNumber}
              type="button"
              className={`w-full px-4 py-2 text-base border ${
                onParams ?
                pageNumber === page
                  ? "text-white bg-primary"
                  : "text-gray-600 bg-white hover:bg-gray-100":
                  pageNumber === currentPage
                  ? "text-white bg-primary"
                  : "text-gray-600 bg-white hover:bg-gray-100"
              }`}
              onClick={() => onPageChangeFunc(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          disabled={page === lastPage}
          type="button"
          className="w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onNext}
        >
          <svg
            width="9"
            fill="currentColor"
            height="8"
            className=""
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
