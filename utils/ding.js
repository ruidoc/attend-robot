const dayjs = require("dayjs");
const axios = require("axios");
const config = require("../config");
const dingApi = require("./http.js");

// 获取打卡状态
const getAttendStatus = (userIdList) => {
  let body = {
    workDateFrom: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    workDateTo: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    userIdList,
    offset: 0,
    limit: 40,
  };
  return dingApi.post(`/attendance/list`, body);
};

// 获取请假状态
const getLeaveStatus = async (userid_list, offset = 0) => {
  let body = {
    start_time: dayjs().startOf("day").valueOf(),
    end_time: dayjs().endOf("day").valueOf(),
    userid_list: userid_list.join(), // userid 列表
    offset,
    size: 20,
  };
  let res = await dingApi.post(`/topapi/attendance/getleavestatus`, body);
  if (res.errcode != 0) {
    return res;
  } else {
    return res.result.leave_status.map((row) => row.userid);
  }
};

// 上班打卡用户
const getOnUids = (attendList) =>
  attendList
    .filter((row) => row.checkType == "OnDuty")
    .map((row) => row.userId);

// 下班打卡用户
const getOffUids = (attendList) =>
  attendList
    .filter((row) => row.checkType == "OffDut")
    .map((row) => row.userId);

// 发送通知消息
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
  dingApi.post(`/robot/send`, infos, {
    params: { access_token: config.rebot_token },
  });
};

module.exports = {
  getAttendStatus,
  getOnUids,
  getOffUids,
  sendNotify,
  getLeaveStatus,
};
