import stables from "@/constants/stables";

export const signUp = async (name, email, password) => {
    try {
        const url = `/api/users/register`;
        const body = {
            name,
            email,
            password,
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };
        const res = await fetch(url, options);
        const data = await res.json();
        return {success: true,
        data};
    } catch (error) {
        return {success: false,
        message: "An unknown error occurred"};
    }
}

export const signIn = async (email, password) => {
    try {
        const url = `${stables.BASE_URL}/api/users/login`;
        const body = {
            email,
            password,
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };
        const res = await fetch(url, options);
        const data = await res.json();
        if(!data?.success){
            throw new Error(data?.message);
        }else{
            return data;
        }
    } catch (error) {
        if(error?.response && error?.response?.data?.message){
            throw new Error(error?.response?.data?.message);
        }
        throw new Error(error.message);
    }
}

export const getUserProfile = async (token) => {
    try {
        const url = `${stables.BASE_URL}/api/users/getProfile`;

        const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };
        const res = await fetch(url, options);
        const data = await res.json();
        if(!data?.success){
            throw new Error(data?.message);
        }else{
            return data;
        }
    } catch (error) {
        if(error?.response && error?.response?.data?.message){
            throw new Error(error?.response?.data?.message);
        }
        throw new Error(error.message);
    }
}

export const updateUserProfile = async (token, userData) => {
    try {
        const url = `${stables.BASE_URL}/api/users/updateProfile`;
        const body = {
            name: userData && userData.name !== undefined ? userData.name : null,
            email: userData && userData.email !== undefined ? userData.email : null,
            avatar: userData && userData.avatar !== undefined ? userData.avatar : null,
            password: userData && userData.password !== undefined ? userData.password : null,
          };
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
        console.log(data);
        if(!data?.success){
            throw new Error(data?.message);
        }else{
            return data;
        }
    } catch (error) {
        if(error?.response && error?.response?.data?.message){
            throw new Error(error?.response?.data?.message);
        }
        throw new Error(error.message);
    }
}



