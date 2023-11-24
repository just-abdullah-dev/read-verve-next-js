import stables from "@/constants/stables";
import Error from "next/error";

export const getPostDetail = async (slug) => {
    try {
        const data = await fetch(`${stables.BASE_URL}/api/posts/getPostDetail?slug=${slug}`).then((res) => res.json());
        return data;
    } catch (error) {
        throw new Error(error.message);
}}

export const getAllPosts = async (searchKeyword = '', page = 1, limit = 9) => {
try {
    const url = `/api/posts/getAllPosts?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`;

    const options = {
        method: 'GET'
    };

    const res = await fetch(url, options);
    const data = await res.json();
    const headers = res.headers;
    console.log(data);
    return {data, headers};
} catch (error) {
    throw new Error(error.message);
}}
export const deletePost = async (token, slug)=>{
    try {
    const url = `/api/posts/deletePost?slug=${slug}`;

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await fetch(url, options);
        const data = await res.json();
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}

export const createPost = async (token, title = '', caption = '') => {
    try {
        const url = `/api/posts/createPost`;
        const body = {
            title,
            caption
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        };
    
        const res = await fetch(url, options);
        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
}}

export const updatePost = async (token, slug, body)=>{
    try {
        const url = `/api/posts/updatePost?slug=${slug}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        };
        const res = await fetch(url, options);
        const data = await res.json();  
        return data;
    } catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}

    