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
    const response = await getNewAccessToken();
    const accessToken = response?.data?.data?.accessToken;
    const config = error?.config;

    if ((error?.response?.status === 400 || 500) && !config?.sent) {
      config.sent = true;
      config.headers.Authorization = accessToken;
      setToLocalStorage(authKey, accessToken);
      setAccessToken(accessToken);

      return instance(config);
    }
    return Promise.reject(error);
  }
);

export { instance };
