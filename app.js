//app.js
App({
  onLaunch: function (ops) {
    console.log(ops)

    //清空本地数据缓存
    wx.clearStorageSync()
    console.log('clear storeage......')

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 购物车初始化
    this.globalData.cart = {}

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res.authSetting)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow:function(){
    // 加载购物车信息
    var storeCart = wx.getStorageSync('cart')
    if (storeCart) {
      console.log('app getStoreData[onLoad] storeCart')
      this.globalData.cart =  storeCart
    }else{
      this.globalData.cart = {}
    }
  },
  onHide:function(){
    // 持久化购物车信息
    var cart = this.globalData.cart
    wx.setStorage({
      key: "cart",
      data: cart
    })
  },
  globalData: {
    userInfo: null,
    baseUrl: 'https://api.haojunyu.com',
    token: null,
    configs: null,
    cart:{}
  }
})