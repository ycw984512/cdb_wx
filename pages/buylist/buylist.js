// pages/promotionlist/promotionlist.js
import {
  request
} from "../../utils/request.js";
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shownavindex: 1,
    priceL1H: true,
    priceL2H: false,
    buyListData: [],
    page: 1,
    size: 10,
    industry_category_id: null,
    name: null,
    store_id: null,
    longitude: null,
    latitude: null,
    province: null,
    city: null,
    district: null,
    title: null,
    origin: "全部地区",
    region: ['', '', ''],
    customItem: '全部',
    showCity: "",
    multiArray: [
      ["全部", '无脊柱动物', '脊柱动物'],
      ["全部"]
    ],
    multiIndex: [0, 0],

    multiArray1: undefined,
    multiIndex1: undefined,
    firstCaregory: [],
    secondCaregory: [],
    firstCaregoryName: [],
    secondCaregoryName: [],


  },
  loadmovies() {
    const {
      page,
      size,
      industry_category_id,
      name,
      store_id,
      longitude,
      latitude,
      region
    } = this.data;
    var token = app.globalData.token;
    var province = region[0] == "全部" ? "" : region[0];
    var city = region[1] == "全部" ? "" : region[1];
    var district = region[2] == "全部" ? "" : region[2];
    request({
      url: `/api/coupon/index`,
      data: {
        page: page,
        list_rows: size,
        industry_category_id: industry_category_id,
        name: name,
        store_id: store_id,
        longitude: longitude,
        latitude: latitude,
        province: province,
        city: city,
        district: district,
        type: 1,
      },
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },

    }).then(res => {
      const data = res.data.data.data;
      const buyListData = this.data.buyListData;
      console.log(buyListData);
      console.log(data);
      buyListData.push(...data);
      console.log(buyListData);
      this.setData({
        buyListData: buyListData
      })

    })

  },
  onPullDownRefresh: function() {
    const page = this.data.page;
    this.setData({
      page: 1,
      buyListData: []
    })
    this.loadmovies();
    wx.stopPullDownRefresh();
  },
  onReachBottom() {
    const page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.loadmovies();
  },

  filterMenuTap: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      shownavindex: index
    });
    if (index == 1) {
      var priceL1H = !this.data.priceL1H;
      this.setData({
        priceL1H: priceL1H,
        priceL2H: false,

      });
    } else if (index == 2) {
      var priceL2H = !this.data.priceL2H;
      this.setData({
        priceL2H: priceL2H,
        priceL1H: false,
      });
    } else {
      this.setData({
        priceL1H: true,
        priceL2H: false,
        page: 1,
        buyListData: []
      });
      this.loadmovies();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var token = app.globalData.token;

    request({
      url: "/api/home/get_all_catetgory",
      header: {
        'content-type': 'application/json', // 默认值
        token: app.globalData.token,
        storeId: app.globalData.storeId,
      },
    }).then(res => {

      console.log(res);

      var allCategory = res.data.data;
      var firstCaregory = [];
      var secondCaregory = [];
      allCategory.forEach((item, index) => {
        if (item.pid == 0) {
          firstCaregory.push(item)
        }
      })

      console.log(firstCaregory, allCategory)



      firstCaregory.forEach((item, index) => {
        var arr = [];
        for (var i = 0; i < allCategory.length; i++) {
          if (item.id == allCategory[i].pid) {
            arr.push(allCategory[i])
          }
        }
        secondCaregory.push(arr)
      })

      secondCaregory.forEach((item,index)=>{
        var id = firstCaregory[index].id;
        var name = firstCaregory[index].name
        item.unshift({
          id: id,
          // name: name+"(全部)",
          name: "全部",
          relName:name
        })
      })

      firstCaregory.unshift({
        id: "",
        name: '全部'
      });

      secondCaregory.unshift([{
        id: "",
        name: '全部'
      }]);

      console.log(firstCaregory, secondCaregory);
      var firstCaregoryName = [];
      firstCaregory.forEach((item, index) => {
        firstCaregoryName.push(item.name)
      })
      var multiArray = that.data.multiArray;
      multiArray[0] = firstCaregoryName;
      that.setData({
        multiArray: multiArray,
        firstCaregory: firstCaregory,
        secondCaregory: secondCaregory,
        firstCaregoryName: firstCaregoryName,
      })


      // var catetgoryArray = [];
      // var catetgoryId = [];
      // res.data.data.forEach((item, index) => {
      //   catetgoryArray.push(item.name);
      //   catetgoryId.push(item.id);
      // })
      // catetgoryArray.unshift("全部分类");
      // catetgoryId.unshift("");

      // console.log(res);
      // that.setData({
      //   catetgoryArray: catetgoryArray,
      //   catetgoryId: catetgoryId,
      // })


      // catetgoryId.forEach((item, index) => {
      //   if (item == industry_category_id) {
      //     that.setData({
      //       catetgoryIndex: index,
      //     })
      //   }
      // })
    })

    var that = this;
    var upload_domain = app.globalData.upload_domain
    var industry_category_id = options.industry_category_id || "";
    var store_id = options.store_id || "";
    var name = options.name || "";
    var title = options.title || "";
    console.log(options)
    this.setData({
      industry_category_id: industry_category_id,
      store_id: store_id,
      name: name,
      upload_domain: upload_domain,
      title: title
    });

    var latitude = app.globalData.latitude;
    var longitude = app.globalData.longitude;
    that.setData({
      latitude: latitude,
      longitude: longitude
    })
    that.loadmovies();



  },

  goBuyDetail(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../buydetail/buydetail?id=' + id,
    })
  },
  goCouponAddress(e) {
    var id = e.currentTarget.dataset.id;


    wx.navigateTo({
      url: '../couponaddress/couponaddress?id=' + id,
    })
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    if (e.detail.value[2] == "全部") {
      if (e.detail.value[1] == "全部") {
        this.setData({
          showCity: e.detail.value[0],

        })
      } else {
        this.setData({
          showCity: e.detail.value[1],

        })
      }
    } else if (e.detail.value[1] == "全部") {
      if (e.detail.value[0] == "全部") {
        this.setData({
          showCity: e.detail.value[0],

        })
      } else {
        this.setData({
          showCity: e.detail.value[1],

        })
      }
    } else {
      this.setData({
        showCity: e.detail.value[2],
   
      })
    }
    this.setData({
      region: e.detail.value,
      origin: "",
      page: 1,
      buyListData: [],

    })
    this.loadmovies();
  },
  bindMultiPickerChange: function(e) {


    var multiArray = this.data.multiArray;
    var multiArray1 = this.data.multiArray1;


    multiArray1 = multiArray;

    

    console.log('picker发送选择改变，携带值为', e.detail.value);
    var indexArr = e.detail.value;

    var index1 = Number(indexArr[0]);

    var index2 = Number(indexArr[1]);

    var firstCaregory = this.data.firstCaregory;

    var secondCaregory = this.data.secondCaregory;

    var sigle = secondCaregory[index1];

    sigle = sigle[index2];

    var id = sigle.id;

    this.setData({
      multiArray1: multiArray1,
      multiIndex1: e.detail.value,
      multiIndex: e.detail.value,
      industry_category_id: id,
      page: 1,
      buyListData: [],
      title: false
    })
    this.loadmovies();
  },
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

    if (e.detail.column == 0) {

      var multiIndex = this.data.multiIndex;

      var secondCaregory = this.data.secondCaregory;

      var index = e.detail.value;

      multiIndex = index;

      var arr = secondCaregory[index];


      var arr1 = [];

      arr.forEach((item, index) => {
        arr1.push(item.name)
      })

      var multiArray = this.data.multiArray;
      
      multiArray[1] = arr1;

      this.setData({
        multiArray: multiArray,
        multiIndex: multiIndex,
        title: false,

      })

    } else if (e.detail.column == 1){


    }

  },


  // bindPickerChange: function(e) {
  //   console.log('picker发送选择改变，携带值为', e);

  //   this.setData({
  //     catetgoryIndex: e.detail.value,
  //     page: 1,
  //     buyListData: [],
  //     industry_category_id: this.data.catetgoryId[e.detail.value]
  //   })
  //   this.loadmovies();
  // },
})