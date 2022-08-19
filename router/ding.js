var express = require("express");
var router = express.Router();
var dayjs = require("dayjs");

const {
  getAttendStatus,
  getOnUids,
  getOffUids,
  sendNotify,
} = require("../utils/ding");

router.get("/", (req, res, next) => {
  res.send("钉钉API");
});

// 打卡状态检测
router.get("/attend-send", async (req, res, next) => {
  try {
    // 获取打卡状态
    let attendList = await getAttendStatus();
    // 是否9点前（上班时间）
    let isOnDuty = dayjs().isBefore(dayjs().hour(9));
    // 是否18点后（下班时间）
    let isOffDuty = dayjs().isAfter(dayjs().hour(18));
    if (isOnDuty) {
      let uids = getOnUids(attendList);
      if (uids.length > 0) {
        sendNotify("上班没打卡，小心扣钱！", uids);
      }
    } else if (isOffDuty) {
      let uids = getOffUids(attendList);
      if (uids.length > 0) {
        sendNotify("下班没打卡，小心扣钱！", uids);
      }
    } else {
      return res.send("不在打卡时间");
    }
    res.send("没有未打卡的同学");
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

module.exports = router;
