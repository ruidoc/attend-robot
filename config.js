// 钉钉 H5 应用公匙
const appkey = "";
// 钉钉 H5 应用私匙
const appsecret = "";
// 钉钉机器人 token
const rebot_token = "";
// 应用监听端口
const port = 8080;

// 检测打卡的钉钉userId
const getUserIds = async () => {
  // 这里返回钉钉userId数组，可以写死，也可以用API获取
  return [];
};

export default {
  appkey,
  appsecret,
  rebot_token,
  port,
  getUserIds,
};
