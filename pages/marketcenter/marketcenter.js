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
    stateList: [{
      name: "已发布",
        num:null
      },
      {
        name: "已下载",
        num: null
      },
      {
        name: "已领取",
        num: null
      },
      {
        name: "已使用",
        num: null
      },
    ],
    selectedIndex: 0,
    marginTop: 20,
    upload_domain: null,
    //数据列表数据
    page1: 1,
    limit1: 15,
    tab1Data: [],
    page2: 1,
    limit2: 15,
    tab2Data: [],
    page3: 1,
    limit3: 15,
    tab3Data: [],
    page4: 1,
    limit4: 15,
    tab4Data: [],
    totalData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    var upload_domain = app.globalData.upload_domain;
    var longitude = app.globalData.longitude;
    var latitude = app.globalData.latitude;
    this.setData({
      upload_domain: app.globalData.upload_domain,

    });
    var that = this;
    wx.createSelectorQuery().selectAll('.top_wrap').boundingClientRect(function(rect) {
      console.log(rect[0]);
      var marginTop = rect[0].height + rect[0].height;
      that.setData({
        marginTop: marginTop
      })
    }).exec()

    var token = app.globalData.token;

    request({
      url: "/api/store/marketing_center",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token, storeId: app.globalData.storeId,
      },
    }).then(res => {

      if (res.data.error_code == 0) {

        //dosome
        console.log(res);
        var stateList = that.data.stateList;

        stateList[0].num = res.data.data.release_coupon_num
        stateList[1].num = res.data.data.user_downLoad_coupon_num
        stateList[2].num = res.data.data.receive_coupon_num
        stateList[3].num = res.data.data.use_coupon_num

        this.setData({
          totalData: res.data.data,
          stateList: stateList
        })

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    })


    var that = this;
    this.loadTab1list();
  },


  turnPage: function(e) {
    var that = this;
    var dataIndex = e.currentTarget.dataset.index;
    if (this.data.selectedIndex != dataIndex) {
      // this.setData({
      //   selectedIndex: dataIndex
      // });
      if (dataIndex == 0) {
        // 获取发布的券数据
        this.setData({
          selectedIndex: dataIndex,
          page2: 1,
          tab2Data: [],
          page3: 1,
          tab3Data: [],
          page4: 1,
          tab4Data: [],
          page1: 1,
          tab1Data: [],
        })
        this.loadTab1list();
      } else if (dataIndex == 1) {
          // 获取下载的券数据
        this.setData({
          selectedIndex: dataIndex,
          page1: 1,
          tab1Data: [],
          page3: 1,
          tab3Data: [],
          page4: 1,
          tab4Data: [],
          page2: 1,
          tab2Data: [],
        })
        this.loadTab2list();
      } else if (dataIndex == 2) {
       // 获取领取的券数据
        this.setData({
          selectedIndex: dataIndex,
          page2: 1,
          tab2Data: [],
          page1: 1,
          tab1Data: [],
          page4: 1,
          tab4Data: [],
          page3: 1,
          tab3Data: [],
        })
        this.loadTab3list();
      } else if (dataIndex == 3) {
        // 获取使用的券数据
        this.setData({
          selectedIndex: dataIndex,
          page2: 1,
          tab2Data: [],
          page3: 1,
          tab3Data: [],
          page1: 1,
          tab1Data: [],
          page4: 1,
          tab4Data: [],
        })
        this.loadTab4list();
      }

    }
  },

  //发布的券函数
  loadTab1list() {
    const {
      page1,
      limit1,
    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/store/release_coupon_list`,
      data: {
        page: page1,
        list_rows: limit1,

      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var tab1Data = this.data.tab1Data.concat(res.data.data.data);
      this.setData({
        tab1Data: tab1Data
      })
    })

  },

  //下载的券函数
  loadTab2list() {
    const {
      page2,
      limit2,
      name,
      longitude,
      latitude
    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/store/user_downLoad_coupon_list`,
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

  //领取的券函数
  loadTab3list() {
    const {
      page3,
      limit3,

    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/store/user_receive_coupon_list`,
      data: {
        page: page3,
        list_rows: limit3,


      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var tab3Data = this.data.tab3Data.concat(res.data.data.data);
      this.setData({
        tab3Data: tab3Data
      })
    })

  },
  //使用的券函数
  loadTab4list() {
    const {
      page4,
      limit4,

    } = this.data;
    var token = app.globalData.token;
    request({
      url: `/api/store/use_coupon_list`,
      data: {
        page: page4,
        list_rows: limit4,

      },
      header: {
        'content-type': 'application/json', // 默认值
        token: token, storeId: app.globalData.storeId,
      },
    }).then(res => {
      //dosome
      console.log(res.data.data.data);
      var tab4Data = this.data.tab4Data.concat(res.data.data.data);
      this.setData({
        tab4Data: tab4Data
      })
    })

  },

  onReachBottom() {
    if (this.data.selectedIndex == 0) {
      const page1 = this.data.page1;
      this.setData({
        page1: page1 + 1
      })
      this.loadTab1list();
    } else if (this.data.selectedIndex == 1) {
      const page2 = this.data.page2;
      this.setData({
        page2: page2 + 1
      })
      this.loadTab2list();
    } else if (this.data.selectedIndex == 2) {
      const page3 = this.data.page3;
      this.setData({
        page3: page3 + 1
      })
      this.loadTab3list();
    } else if (this.data.selectedIndex == 3) {
      const page4 = this.data.page4;
      this.setData({
        page4: page4 + 1
      })
      this.loadTab4list();
    }
  },

})