import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

const post = async (url, data = {}, headers = {}) => {
    try {
        const response = await instance.post(
            url,
            data,
            {
                headers: {
                    ...instance.defaults.headers,
                    ...headers
                }
            },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

const get = async (url, params = {}) => {
    try {
        const response = await instance.get(url, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default { post, get };