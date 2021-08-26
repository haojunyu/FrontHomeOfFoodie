//cake.js
//获取应用实例
var app = getApp(),
    getApiData = require("../../utils/apiData.js").getApiData,
    postApiData = require("../../utils/apiData.js").postApiData,
    putApiData = require("../../utils/apiData.js").putApiData,
    md5 = require("../../utils/md5.js").hex_md5
Page({
  data: {
    snackDetail: {},
    firstImg:null,
    imgUrl: null,
    snackId: null,
    cartCount:null,
    count:1,
    
    location: '昆山市巴城镇吃货家食品店',
    phone: '18261956851',
    showDialog: false
  },
  // 装载页面
  onLoad: function(request){
    console.log(request.id)
    this.setData({
      snackId:request.id
    })
    // 设置imgUrl
    this.setData({
      imgUrl: app.globalData.baseUrl + '/imgs/'
    })
    var that = this
    var token = app.globalData.token + ':none'
    console.log('token: '+token)
    getApiData(app.globalData.baseUrl + '/chj/v1.0/snacks/'+ request.id, {}, token, function(data){
      that.setData({
        snackDetail:data,
        firstImg:data.imgs[0]
      })
    })
    // 获取购物车中数目
    console.log(app.globalData.cart)
    var globalCart = app.globalData.cart
    var count = 1
    var cartCount = 0
    if (globalCart.hasOwnProperty(request.id)){
      count = cartCount['count']
      cartCount = count
    }
    this.setData({
      cartCount: cartCount,
      count:count
    })
    
    // 获取甜点的订单数目
    // 获取完整的评论
  },
  onChangeCnt: function (e) {
    console.log(e)
    this.setData({
      count: e.detail.count
    })
    // 检查是否超出库存或限购数
  },
  // 定位
  locate: function(e){
    console.log('location')
    var latitude=32.19634838375969
    var longitude=119.436195097602

    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })
    /*
    wx.chooseLocation({
      success: function(res){
        console.log(res)
      }
    })
    */
  },
  // 打电话
  call: function(e){
    var phone = e.currentTarget.dataset['phone']
    console.log(phone)

    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  openDialog: function () {
    var that = this
    console.log(that.data.imgUrl+that.data.snackDetail.imgs[0])
    this.setData({
      istrue: true
    })
  },
  closeDialog: function () {
    this.setData({
      istrue: false
    })
  },
  addCart:function(){
    console.log('跳转')
    var count =  this.data.count
    this.setData({
      cartCount:count,
      istrue: false
    })
    // 更新全局购物车
    app.globalData.cart[this.data.snackId] = {count:count,ischeck:true,id:snackId}
    
  },
  stopEvent:function(){
    console.log('汗')
    
  },
  jumpHome:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  jumpCart: function () {
    wx.switchTab({
      url: '/pages/logs/logs'
    })
  },
  // 下单
  gobuy: function(e){
    var token = app.globalData.token + ':none'
    console.log('立即下单......')
    var cashbox = parseFloat(app.globalData.userInfo['cashbox'])
    var price = parseFloat(this.data.cakeDetail['price'])
    console.log(price)
    var fee = 0.00
    var discount = 0.00
    if( cashbox > 0.0){
      if(cashbox <= price){
        fee = price - cashbox
        discount = cashbox
      }else{
        fee = 0.01
        discount = price-0.01
      }
    }else{
      fee = price
    }
    fee = parseFloat(fee).toFixed(2)
    discount = parseFloat(discount).toFixed(2)
    console.log(fee)
    console.log(discount)
    var that = this
    // 获取预付单信息 （金额赋值为this.data.cakeDetail['price']）
    getApiData(app.globalData.baseUrl + '/api/v1.0/prepay', {
      'body' : app.globalData.mch_name + '-' + this.data.cakeDetail['cate']['desc'],
      'total_fee': fee,
      'notify_url': app.globalData.baseUrl + 'api/v1.0/notify'
    }, token, function(data){
      if(data['prepay']['return_code'] = 'SUCCESS' && data['prepay']['result_code']){
        // 付款
        var timeStamp = new Date().getTime().toString()
        var nonceStr = Math.random().toString(36).substr(2)
        var pack = 'prepay_id=' + data['prepay']['prepay_id']
        var signData = 'appId=' + data['prepay']['appid']
        signData += '&nonceStr=' + nonceStr
        signData += '&package=' + pack
        signData += '&signType=MD5&timeStamp='+timeStamp
        signData += '&key=666ZhangWangLuTin00SweetHeart999'
        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': pack,
          'signType': 'MD5',
          'paySign': md5(signData),
          'success':function(res){
            console.log('pay success......')
            console.log(res)
            // 记录单号
            var orderUri = app.globalData.baseUrl + '/api/v1.0/orders'
            var orderData = {}
            orderData['userId']=app.globalData.userInfo['id']
            orderData['cakeId']=that.data.cakeDetail.cakeId
            orderData['status']=1
            orderData['prepayId']=data['prepay']['prepay_id']
            // 更新数据库表orders
            postApiData( orderUri, orderData, token, function(data){
              console.log(data)
              console.log('postApiData[POST] /orders')
            })

            // 更新数据库表user.cashbox
            if(discount != 0.0){
              var userUri = app.globalData.baseUrl + '/api/v1.0/users/' + app.globalData.userInfo['id'] + '/subCash'
              putApiData(userUri, {
                'cash': discount
              }, token, function(res){
                console.log('消费余额'+ discount +'元成功！')
              })
            }

            // 跳转到已下单界面
            wx.redirectTo({
              url: '../orders/orders?status=1'
            })
          },
          'fail':function(res){
            console.log('pay fail......')
            console.log(res)
          }
        })
      }
      console.log(data)
    })
  }

})
