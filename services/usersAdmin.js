import Error from "next/error";

export const getAllUsers = async (token, keyword = '') => {
    try {
        const url = `/api/admin/getAllUsers?keyword=${keyword}`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await fetch(url, options);
        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }}
    
    export const deleteUser = async (token, id)=>{
        try {
        const url = `/api/admin/deleteUser?userID=${id}`;
    
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

    export const updateUser = async (token, {id, admin, author, verified})=>{
        try {
        const url = `/api/admin/updateUser?userID=${id}`;
            let body = {
                admin,
                author,
                verified
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
            if (error.response && error.response.data.message)
                throw new Error(error.response.data.message);
            throw new Error(error.message);
        }
    }
// export const getAllPosts = async (searchKeyword = '', page = 1, limit = 9) => {
// try {
//     const url = `/api/posts/getAllPosts?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`;

//     const options = {
//         method: 'GET'
//     };

//     const res = await fetch(url, options);
//     const data = await res.json();
//     const headers = res.headers;
//     console.log(data);
//     return {data, headers};
// } catch (error) {
//     throw new Error(error.message);
// }}

// export const createPost = async (token, title = '', caption = '') => {
//     try {
//         const url = `/api/posts/createPost`;
//         const body = {
//             title,
//             caption
//         }
//         const options = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(body),
//         };
    
//         const res = await fetch(url, options);
//         const data = await res.json();
//         return data;
//     } catch (error) {
//         throw new Error(error.message);
// }}

// export const updatePost = async (token, slug, body)=>{
//     try {
//         const url = `/api/posts/updatePost?slug=${slug}`;
//         const options = {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(body),
//         };
//         const res = await fetch(url, options);
//         const data = await res.json();  
//         console.log(data);      
//         return data;
//     } catch (error) {
//         if (error.response && error.response.data.message)
//             throw new Error(error.response.data.message);
//         throw new Error(error.message);
//     }
// }

    