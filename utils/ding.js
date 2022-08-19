const dayjs = require("dayjs");
const { config } = require("process");
const dingApi = require("./http.js");

const userIdList = ["xxx"]; // userid 列表

const getAttendStatus = () => {
  let body = {
    workDateFrom: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    workDateTo: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    userIdList,
    offset: 0,
    limit: 40,
  };
  return dingApi.post(`/attendance/list`, body);
};

// 获取上班未打卡用户
const getOnUids = (attendList) =>
  attendList
    .filter((row) => row.checkType == "OnDuty" && row.timeResult == "NotSigned")
    .map((row) => row.userId);

// 下班未打卡用户
const getOffUids = (attendList) =>
  attendList
    .filter((row) => row.checkType == "OffDut" && row.timeResult == "NotSigned")
    .map((row) => row.userId);

const sendNotify = (msg, atuids = []) => {
  // 消息模版配置
  let infos = {
    msgtype: "text",
    text: {
      content: msg,
    },
    at: {
      atUserIds: atuids,
    },
  };
  // API 发送消息
  axios.post(`${baseURL}/robot/send`, infos, {
    params: { access_token: config.rebot_token },
  });
};

module.exports = {
  getAttendStatus,
  getOnUids,
  getOffUids,
  sendNotify,
};
