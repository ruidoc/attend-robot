import fs from "fs";
import path from "path";
import axios from "axios";
import config from "../config.js";

var catch_dir = path.resolve("./", "catch");

export const dingToken = {
  get: () => {
    let res = fs.readFileSync(`${catch_dir}/ding_token.json`);
    return res.toString() || null;
  },
  set: (token) => {
    fs.writeFileSync(`${catch_dir}/ding_token.json`, token);
  },
};

export const fetchToken = async () => {
  try {
    let params = {
      appkey: config.appkey,
      appsecret: config.appsecret,
    };
    let url = "https://oapi.dingtalk.com/gettoken";
    let result = await axios.get(url, { params });
    if (result.data.errcode != 0) {
      throw result.data;
    } else {
      let token_str = JSON.stringify({
        token: result.data.access_token,
        expire: Date.now() + result.data.expires_in * 1000,
      });
      dingToken.set(token_str);
      return token_str;
    }
  } catch (error) {
    console.log(error);
  }
};
