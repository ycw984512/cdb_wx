//app.js

import { request } from "./utils/request.js"   
import GlobalConfig from './config/index'

const globalConfig = new GlobalConfig()

globalConfig.init()


App({
  globalData: {
    token: null,
    wechat_title:null,
    platform_name: null,
    platform_phone: null,
    introduce: null,
    upload_domain: null,
    longitude:null,
    latitude:null,
    service_charge:null,
    // imgUploadUrl: "https://www.zbcdb.com",
    imgUploadUrl: "https://cdb.0797i.cn",
    panic_buying_coupon_release_agreement:null,
    promotion_coupon_release_agreement:null,
    coupon_release_integral:null,
    is_store:0,
    config: globalConfig,
    storeId:""
  },
  onLaunch: function () {


  },


})