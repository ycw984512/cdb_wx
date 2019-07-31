// pages/mycodedetail/mycodedetail.js
// pages/orderList/orderList.js
import {
  request
} from "../../utils/request.js";
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page2: 1,
    limit2: 999,
    tab2Data: [],
    upload_domain:undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var upload_domain = app.globalData.upload_domain;

    this.setData({
      upload_domain:upload_domain,

    });
    this.loadTab2list();
  },

  //推广记录
  loadTab2list() {
    const {
      page2,
      limit2,
    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/user/extension_records`,
      data: {
        page: page2,
        list_rows: limit2,
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var tab2Data = this.data.tab2Data.concat(res.data.data.data);
      this.setData({
        tab2Data: tab2Data
      })
    })

  },

})