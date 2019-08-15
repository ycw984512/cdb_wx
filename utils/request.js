const baseURL = "https://www.zbcdb.com"

// const baseURL = "https://cdb.0797i.cn"
const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + options.url,
      method: options.method || "post",
      data: options.data || "",
      header: options.header || {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

module.exports = {
  request: request,
  baseURL: baseURL
}