import { authKey } from "@/constant/authKey";
import setAccessToken from "@/services/action/setAccessToken";
import { getNewAccessToken } from "@/services/auth.services";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";
import axios from "axios";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

instance.interceptors.request.use(
  function (config) {
    const accessToken = getFromLocalStorage(authKey);

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh-token");
    const shouldRetry =
      (error?.response?.status === 401 || error?.response?.status === 403) &&
      !originalRequest?.__isRetryRequest &&
      !isRefreshCall;

    if (shouldRetry) {
      try {
        const response = await getNewAccessToken();
        const newAccessToken = response?.data?.data?.accessToken;

        setToLocalStorage(authKey, newAccessToken);
        setAccessToken(newAccessToken);

        originalRequest.__isRetryRequest = true;
        originalRequest.headers.Authorization = newAccessToken;

        return instance(originalRequest);
      } catch (refreshError) {
        // Optional: logout or redirect if refresh fails
        console.error("🔴 Refresh token failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { instance };
