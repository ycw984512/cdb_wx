var app = getApp();
import { request } from "../../utils/request.js";  
Page({
  data: {
    list: [{
      id: "form",
      question: "积分",
      open: !1,
      answer: "优惠券的帮助中心主要显示用户可能回碰到的问题,正在开发中，敬请期待"
    }, {
      id: "form",
        question: "抢购券",
      open: !1,
        answer: "优惠券的帮助中心主要显示用户可能回碰到的问题,正在开发中，敬请期待"
      }, {
        id: "form",
        question: "促销券",
        open: !1,
        answer: "优惠券的帮助中心主要显示用户可能回碰到的问题,正在开发中，敬请期待"
      }, {
        id: "form",
        question: "钱包",
        open: !1,
        answer: "优惠券的帮助中心主要显示用户可能回碰到的问题,正在开发中，敬请期待"
      }, {
      id: "form",
        question: "礼包",
      open: !1,
        answer: "优惠券的帮助中心主要显示用户可能回碰到的问题,正在开发中，敬请期待"
    }]
  },
  kindToggle: function (n) {
    var o = n.currentTarget.id,
      e = this.data.list;
    console.log(o);
    for (var t = 0, a = e.length; t < a; ++t) e[t].open = t == o && !e[t].open;
    this.setData({
      list: e
    })
  },
  onLoad: function (n) {
    var o = this;
    var token = app.globalData.token;

    request({
      url: "/api/help_center/index",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token
      },
    }).then(res => {
      //dosome
      console.log(res);
      o.setData({
        list: res.data.data.data,
      })
    })

  },
});