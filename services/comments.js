import Error from "next/error";

export const createComment = async (token, slug, desc, parent, replyOnUser) => {
    try {
        const url = `/api/comments/createComment`;
        const body = {
            slug,
            desc, 
            parent,
            replyOnUser,
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

export const updateComment = async (token, desc, _id) => {
    try {
        const url = `/api/comments/updateComment`;
        const body = {
            _id,
            desc,
        }
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
        throw new Error(error.message);
}}

export const deleteComment = async (token, _id) => {
    try {
        const url = `/api/comments/deleteComment`;
        console.log(_id);
        const body = {
            _id,
        }
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        };

        const res = await fetch(url, options);
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        throw new Error(error.message);
}}
