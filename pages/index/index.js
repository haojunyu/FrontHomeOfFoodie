//index.js
//获取应用实例
const app = getApp(),
getApiData = require("../../utils/apiData.js").getApiData

Page({
  data: {
    categories: ['推荐','进口','特产'],
    activeIndex: 0, // 选中类型的索引
    sliderOffset: 0,
    sliderWidth: 0,
    baseUrl: app.globalData.baseUrl,
    snacks: {},
    cart:{},
    cartNum:0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('index begin...')
    /*
    // 购物车加载
    var storeCart =  wx.getStorageSync('cart')
    if (storeCart){
      console.log('getStoreData[onLoad] storeCart')
      var cartNum = 0
      for (var key in storeCart) {
        cartNum += o[key];
      }
      this.setData({
        cart: storeCart,
        cartNum: cartNum
      })
      if(cartNum>0){
        wx.setTabBarBadge({
          index: 1,
          text: cartNum.toString()
        })
      }
    }
    */
    /*
    // 从全局变量获取购物车信息
    var cartNum = 0
    var globalCart =  app.globalData.cart
    for (var key in globalCart) {
      cartNum += o[key];
    }
    this.setData({
      cart: globalCart,
      cartNum: cartNum
    })
    if (cartNum > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: cartNum.toString()
      })
    }
    */
    //var storeCakes = wx.getStorageSync(cateUrl)
    var storeSnacks =  null
    if (storeSnacks) {
      console.log('getStoreData[onLoad] storeSnacks')
      this.setData({
        snacks: storeSnacks
      })
    } else {
      var that = this
      // 多标签
      wx.getSystemInfo({
        success: function (res) {
          var width = res.windowWidth / that.data.categories.length
          that.setData({
            sliderWidth: width,
            sliderOffset: width * that.data.activeIndex
          });
        }
      });

      var token = app.globalData.token + ':none'
      getApiData(app.globalData.baseUrl + '/chj/v1.0/snacks', {}, token, function (data) {
        console.log('getApiData[onLoad] snacks')
        that.setData({
          snacks: data.snacks
        })
        wx.setStorageSync('snacks', data.snacks)
      })
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    // 从全局变量获取购物车信息
    var cartNum = 0
    var globalCart = app.globalData.cart
    for (var key in globalCart) {
      cartNum += globalCart[key]['count'];
    }
    this.setData({
      cart: globalCart,
      cartNum: cartNum
    })
    if (cartNum > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: cartNum.toString()
      })
    }
  },
  onUnLoad: function () {
    // 页面销毁前保存购物车信息
    app.globalCart = this.data.cart
    /*
    var  cart = this.data.cart
    wx.setStorage({
      key: "cart",
      data: cart
    })
    */
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log('allow')
    } else {
      //用户按了拒绝按钮
      console.log('forbid')
    }
  },
  onChangeCnt: function(e){
    var cart = this.data.cart
    var snackId = e.currentTarget.dataset.id
    cart[snackId] = {count:e.detail.count,ischeck:true,id:snackId}
    var cartNum = 0
    for (var key in cart) {
      cartNum += cart[key]['count'];
    }
    this.setData({
      cart: cart,
      cartNum:cartNum
    })
    if (cartNum > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: cartNum.toString()
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
