var app = getApp();
import {
  request
} from "../../utils/request.js";
Page({
  data: {
    personList: [],
    personUrl: "",
    page: 1,
    list_rows: 999,
    upload_domain: null
  },

  onLoad: function(options) {
    var upload_domain = app.globalData.upload_domain;
    this.setData({
      upload_domain: app.globalData.upload_domain,
    });
    var token = app.globalData.token;
    var storeId = app.globalData.storeId;
    const {
      page,
      list_rows
    } = this.data
    //获取添加员工小程序码
    request({
      url: "/api/store_staff/add_staff_code",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: storeId
      },

    }).then(res => {
      //dosome
      if (res.data.error_code == 0) {
        console.log(res);
        this.setData({
          personUrl: res.data.data.code_img,
        })

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    })

    //员工列表
    request({
      url: "/api/store_staff/index",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId
      },
      data: {
        page,
        list_rows
      }

    }).then(res => {

      if (res.data.error_code == 0) {
        //dosome
        console.log(res);
        this.setData({
          personList: res.data.data.data,
        })

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    })

  },


  //删除员工
  removePerson(e) {
    var id = e.currentTarget.dataset.id;
    var token = app.globalData.token;

    request({
      url: "/api/store_staff/del_staff",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId
      },
      data: {
        id: id
      }

    }).then(res => {
      if (res.data.error_code == 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })

        setTimeout(function() {
          wx.redirectTo({
            url: '../addperson/addperson',
          });
        }, 1000)


      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }
    })

  },
  onReachBottom: function() {},

});