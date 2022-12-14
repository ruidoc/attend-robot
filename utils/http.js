import axios from "axios";
import { fetchToken, dingToken } from "./token.js";
const source = axios.CancelToken.source();

// 创建实例，设置通用配置
const instance = axios.create({
  baseURL: "https://oapi.dingtalk.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  cancelToken: source.token,
});

instance.interceptors.request.use(async (config) => {
  config.params = config.params || {};
  if (!config.params.access_token) {
    let catoken = {};
    if (dingToken.get()) {
      catoken = JSON.parse(dingToken.get());
      if (Date.now() - catoken.expire >= 0) {
        console.log("钉钉 token 过期");
        // source.cancel('token已失效')
        await fetchToken();
        catoken = JSON.parse(dingToken.get());
      }
    } else {
      await fetchToken();
      catoken = JSON.parse(dingToken.get());
    }
    config.params.access_token = catoken.token;
  }
  return config;
});

instance.interceptors.response.use(
  (result) => {
    let res = result.data;
    // 钉钉请求失败
    if (res.errcode == 88) {
      handleError(res);
    }
    return result.data;
  },
  (error) => {
    const { response } = error;
    return Promise.reject(response || error);
  }
);

const handleError = async (res) => {
  console.log("ding-api error：", res);
  try {
    if (res.sub_code == "40014") {
    }
  } catch (error) {
    // console.log(error)
  }
};

export default instance;
