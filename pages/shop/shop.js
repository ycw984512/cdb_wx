// pages/home/home.js
// var request = require("../../utils/request.js").request;
var utils = require("../../utils/utils.js").formatTime;
import { request } from "../../utils/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    testData: []
  },

  onclick() {
    request({
      url: "/mock/5cf0c9643a6d9356cd506250/example/mock",
    }).then(res => {

      this.setData({
        testData: res.data.data.projects
      })
    })
  }
})