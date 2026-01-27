import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { use } from 'react';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api',
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const { accessToken} = useAuthStore.getState();
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use((res) => res, async (error) => {
const originalRequest = error.config;

if(originalRequest.url.includes('auth/signin') || originalRequest.url.includes('auth/signup') || originalRequest.url.includes('auth/refresh')){
    return Promise.reject(error);
}

originalRequest._retry = originalRequest._retry || 0;

if(error.response?.status === 403 && originalRequest._retry < 4){
    originalRequest._retry += 1;
    try {
        const res = await api.post('/auth/refresh', {}, {withCredentials: true});
        const newAccessToken = res.data.accessToken;
        useAuthStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
    } catch (error) {
        useAuthStore.getState().clearState();
        return Promise.reject(error);
    }
}
return Promise.reject(error);
});
export default api;