//获取应用实例
var app = getApp(),
  getApiData = require("../../utils/apiData.js").getApiData
Page({
  data: {
    snacks: null,
    orders: [],
    cartArr: null,
    cartNum:null,
    imgUrl:null
  },
  // 装载页面
  onLoad: function () {
    // 设置imgUrl
    this.setData({
      imgUrl: app.globalData.baseUrl + '/imgs/'
    })
  },
  // 显示界面
  onShow: function () {
    console.log(app.globalData)
    var storeSnacks = wx.getStorageSync("snacks")
    if (storeSnacks) {
      console.log('cart getStoreData[onLoad] storeSnacks')
      this.setData({
        snacks: storeSnacks
      })
    }

    // 从全局变量获取购物车信息
    var cartNum = 0
    var globalCart = app.globalData.cart
    var cartArr = []
    for (var key in globalCart) {
      var cart = globalCart[key]
      cart['info'] = storeSnacks[key]
      cartArr.push(cart)
      cartNum += globalCart[key]['count'];
    }
    console.log(cartArr)
    this.setData({
      cartArr: cartArr,
      cartNum: cartNum
    })
  },
  goComment: function (e) {
    console.log(e)
    var cakeId = e.currentTarget.dataset.cakeid
    var orderId = e.currentTarget.dataset.orderid
    console.log(cakeId)
    console.log(orderId)
    wx.navigateTo({
      url: '../comment/comment?cakeId=' + cakeId + '&orderId=' + orderId
    })
  },
  goCakeDetail: function (e) {
    var cakeUri = e.currentTarget.dataset.uri
    wx.navigateTo({
      url: '../cake/cake?uri=' + cakeUri
    })
  }
})