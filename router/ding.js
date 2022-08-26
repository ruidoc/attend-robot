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
    // 需要检测打卡的 userid 数组
    let alluids = ["xxx", "xxxx"];
    // 获取打卡状态
    let attendList = await getAttendStatus(alluids);
    // 是否9点前（上班时间）
    let isOnDuty = dayjs().isBefore(dayjs().hour(9).minute(0));
    // 是否18点后（下班时间）
    let isOffDuty = dayjs().isAfter(dayjs().hour(18).minute(0));
    if (isOnDuty) {
      // 已打卡用户
      let uids = getOnUids(attendList);
      if (alluids.length > uids.length) {
        // 未打卡用户
        let txuids = alluids.filter((r) => !uids.includes(r));
        sendNotify("上班没打卡，小心扣钱！", txuids);
      }
    } else if (isOffDuty) {
      // 已打卡用户
      let uids = getOffUids(attendList);
      if (alluids.length > uids.length) {
        // 未打卡用户
        let txuids = alluids.filter((r) => !uids.includes(r));
        sendNotify("下班没打卡，小心扣钱！", txuids);
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
