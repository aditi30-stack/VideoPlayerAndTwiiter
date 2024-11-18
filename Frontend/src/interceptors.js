import axios from "axios";


export const axioInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    timeout: 60000,
    withCredentials: true
});

export const setupInterceptors = (navigate) => {
    axioInstance.interceptors.response.use(
        (response) => response, 
        async (error) => {
            const originalRequest = error.config;
            

            
            if (originalRequest.url === '/user/refreshToken' || originalRequest._retry) {
                return Promise.reject(error);
            }

            
            if (error.response) {
                if ((error.response.status === 401 || error.response.status === 500) && !originalRequest._retry) {
                    originalRequest._retry = true;


                    try {
                        const refreshResponse = await axioInstance.get('/user/refreshToken');
                        if (refreshResponse.status === 200) {
                            return axioInstance(originalRequest); 
                        }
                    } catch (e) {
                        navigate("/login")
                        console.log("Error refreshing token:", e);
                        
                    }
                }

                if (error.response.status === 403 || error.response.data.message === "Unauthorized request") {
                    
                    navigate('/login');  
                }
            } else {
                console.log("Network or other error:", error);  
            }

            return Promise.reject(error);
        }
    );
};
